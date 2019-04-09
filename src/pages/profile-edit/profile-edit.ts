import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbApiService } from "../../shared/db-api.service";
import { AuthProvider } from "../../providers/auth/auth";
import { CloudinaryOptions, CloudinaryUploader} from 'ng2-cloudinary';
import {environment} from "../../environments/environment";

/**
 * Generated class for the ProfileEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {
  userForm: FormGroup;
  private user:any;
  cloud_name = environment.cloudinary.cloud_name;
  private loading: Loading;
  public_id: string;
  private Userphoto

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({
      cloudName: environment.cloudinary.cloud_name,
      uploadPreset: environment.cloudinary.upload_preset
    })
  );
  prueba: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public authProvider: AuthProvider,
              public dbapi: DbApiService,
              public loadingCtrl: LoadingController
  ) {
    this.user = navParams.data;
    this.userForm = this.createMyForm();
    this.Userphoto= this.user.photo


  }
  private createMyForm(){
    return this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      category:['',Validators.required],
      description: ['', Validators.required],
      salary: ['', Validators.required],
    });
  }

  saveUserData(){
    console.log("uploading");
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    if(this.uploader.queue.length){
      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        let res: any = JSON.parse(response);
        console.log(res);
        this.Userphoto = res.public_id;
        this.dbapi.push(
          "users",
          {
            lastName:    this.userForm.value.lastName,
            name:        this.userForm.value.name,
            email:       this.userForm.value.email,
            category:    this.userForm.value.category,
            description: this.userForm.value.description,
            salary:      this.userForm.value.salary,
            admin:       this.user.admin,
            photo:       this.Userphoto
          })
          .then(() => this.dbapi.getCurrentUser())
          .then(val => {
            this.authProvider.currentUser = val;
            console.log("nuevo valor: ", val);
          })
          .then(() => this.backToProfile());
        this.loading.dismiss();
      };
    }else{
      this.dbapi.push(
        "users",
        {
          lastName:    this.userForm.value.lastName,
          name:        this.userForm.value.name,
          email:       this.userForm.value.email,
          category:    this.userForm.value.category,
          description: this.userForm.value.description,
          salary:      this.userForm.value.salary,
          admin:       this.user.admin,
          photo:      this.Userphoto
        })
        .then(() => this.dbapi.getCurrentUser())
        .then(val => {
          this.authProvider.currentUser = val;
          console.log("nuevo valor: ", val);
        })
        .then(() => this.backToProfile());
      this.loading.dismiss();
    }
  }

  backToProfile() {
    this.navCtrl.pop();
  }

  //-----------IMG Functions-------------//
  onFileSelected(event: Event) {
    console.log(event);
  }

  onUpload() {
    console.log("uploading");
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      console.log(res);
      this.public_id = res.public_id;
      /*this.saveUserData(this.public_id)*/
    };
    this.uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    this.loading.dismiss();
  }

}
