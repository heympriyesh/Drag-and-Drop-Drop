import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'upload-manager',
  templateUrl: './upload-manager.component.html',
  styleUrls: ['./upload-manager.component.css'],
})
export class UploadManagerComponent implements OnInit {
  public aufgaben: Observable<any>[];

  isHovering: boolean;
  files: File[] = [];
  form: FormGroup;
  public fileType = [];
  public value: any;
  public bytetomb: number = 1048576;
  public len: number = 1;
  public visible = false;
  public FileUploadList: any;
  public checkFile: File[] = [];
  public isVisible: Boolean = false;
  public buttonLoading: Boolean = false;
  public uploadStart: Boolean = false;
  public disableButton: Boolean = true;
  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private ren: Renderer2,
    public fireservices: AngularFirestore
  ) {}
  @ViewChild('inputField') inputField: ElementRef;

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
    { label: 'JPG', value: 'jpg' },
    { label: 'PNG', value: 'png' },
    { label: 'PDF', value: 'pdf' },
    { lable: 'EXCEL', value: 'xlsx' },
  ];
  public rangeValue = [0, 10];

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
    console.log('detail', this.fileType);
  }

  createMessage(type: string, message: any): void {
    this.message.create(type, message);
  }

  onDrop(files: FileList) {
    // console.log('The files details on drop', files, this.value);
    this.uploadStart = false;
    this.disableButton = false;
    let small = this.value[0];
    let large = this.value[1];
    // console.log('small', small, 'large', large);
    for (let i = 0; i < files.length; i++) {
      // console.log('this.files.item', files.item(i));
      let prop = files.item(i).name.split('.').pop();
      let size = files.item(i).size;
      if (this.fileType.includes(prop)) {
        if (
          +size >= +small * this.bytetomb &&
          +size <= +this.bytetomb * large
        ) {
          this.files.push(files.item(i));
        } else {
          this.createMessage(
            'error',
            `File must me between size ${this.value[0]}mb to ${this.value[1]}mb.`
          );
        }
      } else {
        this.inputField.nativeElement.value = '';

        if (this.fileType.length == 0) {
          this.disableButton = true;
          this.createMessage(
            'error',
            `Please Select a file type before uploading...!`
          );
        } else {
          this.createMessage(
            'error',
            `Please upload only  ${this.fileType} file type.`
          );
        }
      }
    }
  }

  showModal() {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  removeFile(index) {
    this.files = this.files.filter((data, i) => {
      if (i != index) {
        return data;
      }
    });
    this.FileUploadList = [...this.files];
    if (this.files.length == 0) {
      this.inputField.nativeElement.value = '';
      this.isVisible = false;
      this.disableButton = true;
    }
  }

  startUploading() {
    this.buttonLoading = true;
    this.isVisible = false;
    this.FileUploadList = [...this.files];
    setTimeout(() => {
      this.buttonLoading = false;
      this.uploadStart = true;
      this.disableButton = true;
      this.inputField.nativeElement.value = '';
      this.files = [];
    }, 1000);
  }

  modalUploading() {
    this.FileUploadList = [...this.files];
    this.isVisible = false;
    this.uploadStart = true;
    this.disableButton = true;
    this.inputField.nativeElement.value = '';
    setTimeout(() => {
      this.files = [];
    }, 1000);
  }
}
