import { Component, OnInit, Input, Renderer2 } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { NzImageService } from "ng-zorro-antd/image";
@Component({
  selector: "upload-task",
  templateUrl: "./upload-task.component.html",
  styleUrls: ["./upload-task.component.css"],
})
export class UploadTaskComponent implements OnInit {
  @Input() file: any;
  @Input() length: number;
  fileCheck: File[] = [];
  task: AngularFireUploadTask; // this does the uploading for us
  public loading: Boolean = true;
  public cancel = null;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  public isVisible = false;
  public check = 0;
  public src: any;
  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private nzImageService: NzImageService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.startUpload();
    this.check++;
  }

  startUpload() {
    console.log("uploading fileCheck", this.file);
    let safeName = this.file.name.replace(/([^a-z0-9.]+)/gi, ""); // this.fileCheck name stripped of spaces and special chars
    let timestamp = Date.now(); // ex: '1598066351161'
    const uniqueSafeName = timestamp + "_" + safeName;
    const path = "uploads/" + uniqueSafeName; // Firebase storage path
    const ref = this.storage.ref(path); // reference to storage bucket

    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges(); // progress monitoring
    this.snapshot = this.task.snapshotChanges().pipe(
      // emits a snapshot of the transfer progress every few hundred milliseconds
      tap(console.log),
      finalize(async () => {
        // after the observable completes, get the this.fileCheck's download URL
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.db
          .collection("files")
          .doc(uniqueSafeName)
          .set({
            storagePath: path,
            downloadURL: this.downloadURL,
            originalName: this.file.name,
            timestamp: timestamp,
          })
          .then(function () {
            console.log("document written!", this.downloadURL);
          })
          .catch(function (error) {
            console.error("Error writing document:", error);
          });
      })
    );
  }

  isActive(snapshot) {
    return (
      snapshot.state === "running" &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  showModal(link, type?) {
    if (type == "image/jpeg" || type == "image/png" || type == "image/jpg") {
      this.previewImage(link);
    } else {
      this.isVisible = true;
      this.src = link;
      setTimeout(() => {
        let iframe = document.getElementById("iframe");
        this.renderer.setProperty(iframe, "src", link);
        this.loading = false;
        this.src = link;
      }, 1000);
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.loading = true;
    this.src = "";
  }

  previewImage(downloadURL): void {
    const images = [
      {
        src: downloadURL,
        width: "500px",
        height: "500px",
        alt: "ng-zorro",
      },
    ];
    this.nzImageService.preview(images, { nzZoom: 1.5, nzRotate: 0 });
  }
}
