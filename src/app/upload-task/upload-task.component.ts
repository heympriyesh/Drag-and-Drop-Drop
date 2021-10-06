import { Component, OnInit, Input } from "@angular/core";
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

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  public isVisible = false;
  public check = 0;
  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private nzImageService: NzImageService
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

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  onClick(downloadURL): void {
    console.log("The value of downloadUrl", downloadURL);
    const images = [
      {
        src: downloadURL,
        width: "200px",
        height: "200px",
        alt: "ng-zorro",
      },
    ];
    this.nzImageService.preview(images, { nzZoom: 1.5, nzRotate: 0 });
  }
}
