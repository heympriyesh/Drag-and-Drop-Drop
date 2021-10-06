import { Component, OnInit } from "@angular/core";
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
  public len:number=1;
  constructor(private message: NzMessageService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.value = this.rangeValue;
    this.setForm();
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
    let small = this.value[0] ? this.value[0] : 1;
    let large = this.value[1];
    console.log("small", small, "large", large);
    for (let i = 0; i < files.length; i++) {
      let prop = files.item(i).name.split(".").pop();
      let size = files.item(i).size;
      console.log(
        "🚀 ~ file: upload-manager.component.ts ~ line 74 ~ UploadManagerComponent ~ onDrop ~ size",
        size
      );
      if (this.fileType.includes(prop)) {
        if (small == 0) {
          small = 1;
        }
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