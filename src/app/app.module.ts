import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { UploadManagerComponent } from "./upload-manager/upload-manager.component";
import { UploadTaskComponent } from "./upload-task/upload-task.component";
import { DropzoneDirective } from "./directives/dropzone.directive";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from "../environments/environment";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";
import { NZ_I18N } from "ng-zorro-antd/i18n";
import { en_US } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzImageService } from "ng-zorro-antd/image";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzSliderModule } from "ng-zorro-antd/slider";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzModalModule } from "ng-zorro-antd/modal";

registerLocaleData(en);
let AntDesign = [
  NzUploadModule,
  NzIconModule,
  NzButtonModule,
  NzTableModule,
  NzProgressModule,
  NzMessageModule,
  NzCheckboxModule,
  NzGridModule,
  NzSliderModule,
  NzFormModule,
  NzModalModule,
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadManagerComponent,
    UploadTaskComponent,
    DropzoneDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AntDesign,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, NzImageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
