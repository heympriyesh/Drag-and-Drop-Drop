import { Component, OnInit, Renderer2 } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
@Component({
  selector: "upload-manager",
  templateUrl: "./upload-manager.component.html",
  styleUrls: ["./upload-manager.component.css"],
})
export class UploadManagerComponent implements OnInit {
  isHovering: boolean;
  files: File[] = [];
  form: FormGroup;
  public fileType = ["jpg"];
  public value: any;
  public bytetomb: number = 1048576;
  public len: number = 1;
  public visible = false;
  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private ren: Renderer2
  ) {}

  ngOnInit(): void {
    this.value = this.rangeValue;
    this.setForm();
    // let iframe = document.getElementById("iframe");
    // console.log(
    //   "🚀 ~ file: upload-manager.component.ts ~ line 32 ~ UploadManagerComponent ~ ngOnInit ~ iframe",
    //   iframe
    // );
    // this.ren.setProperty(
    //   iframe,
    //   "src",
    //   "https://firebasestorage.googleapis.com/v0/b/app-drag-and-drop.appspot.com/o/uploads%2F1633618750304_e73a70b5adc9430dbd3ae5f52743c26b.pdf?alt=media&token=07e49c4d-56a0-4292-b4f4-9128a1cefeb1"
    // );
  }
  setForm() {
    this.form = this.fb.group({
      checkOptionsOne: [this.checkOptionsOne],
      rangeValue: [this.rangeValue],
    });
  }

  checkOptionsOne = [
    { label: "JPG", value: "jpg", checked: true },
    { label: "PNG", value: "png" },
    { label: "PDF", value: "pdf" },
    { lable: "EXCEL", value: "xlsx" },
  ];
  public rangeValue = [5, 50];

  onChange(value: number): void {
    console.log(`onChange: ${value}`);
  }

  onAfterChange(value: number[] | number): void {
    this.value = [];
    this.value = value;
    console.log(`onAfterChange: ${this.value}`);
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  log(detail) {
    this.fileType = [];
    this.fileType = [...detail];
    console.log("detail", this.fileType);
  }

  createMessage(type: string, message: any): void {
    this.message.create(type, message);
  }

  onDrop(files: FileList) {
    console.log("The files details on drop", files, this.value);
    let small = this.value[0];
    let large = this.value[1];
    console.log("small", small, "large", large);
    for (let i = 0; i < files.length; i++) {
      let prop = files.item(i).name.split(".").pop();
      let size = files.item(i).size;
      if (this.fileType.includes(prop)) {
        if (
          +size >= +small * this.bytetomb &&
          +size <= +this.bytetomb * large
        ) {
          this.files.push(files.item(i));
        } else {
          console.log(
            "the value of small",
            small,
            large,
            large * this.bytetomb,
            size >= small * this.bytetomb,
            size <= this.bytetomb * large
          );
          this.createMessage(
            "error",
            `File must me between size ${this.value[0]}mb to ${this.value[1]}mb.`
          );
        }
      } else {
        this.createMessage(
          "error",
          `Please upload only  ${this.fileType} file type.`
        );
      }
      // console.log("file ext", files.item(i).name.split(".").pop());
      //   this.fileCheck.push(files.item(i));
      // this.files.push(files.item(i));
    }
  }
}
