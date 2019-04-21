import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbApiService } from "../../shared/db-api.service";
import { AuthProvider } from "../../providers/auth/auth";
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { environment } from "../../environments/environment";
import {CategoriesProvider} from "../../providers/categories/categories";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

/**
 * Generated class for the ProfileEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {
  userForm        : FormGroup;
  private user    :any;
  private loading : Loading;
  public_id       : string;
  private Userphoto;
  private types = [
    {type: 'autonomous', name: 'Autonomous'},
    {type: 'client',     name: 'Client'}
  ]

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({
      cloudName: environment.cloudinary.cloud_name,
      uploadPreset: environment.cloudinary.upload_preset
    })
  );
  iconDoor = faDoorOpen;

  constructor(public navCtrl             : NavController,
              public navParams           : NavParams,
              public formBuilder         : FormBuilder,
              public authProvider        : AuthProvider,
              public dbapi               : DbApiService,
              public loadingCtrl         : LoadingController,
              private categoriesProvider : CategoriesProvider
  ) {
    this.user      = navParams.data;
    this.userForm  = this.createMyForm();
    this.Userphoto = this.user.photo
  }


  private createMyForm(){
    return this.formBuilder.group({
      name: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(10)]],
      lastName: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(10)]],
      email: ['', Validators.required],
      address: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      category: this.user.category,
      userType: this.user.userType,
      description: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(500)]],
      salary: ['', Validators.required],
    });
  }


  async saveUserData() {
    console.log("uploading", this.userForm);
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    let userNewData =
      {
        lastName    : this.userForm.value.lastName,
        name        : this.userForm.value.name,
        email       : this.userForm.value.email,
        category    : this.userForm.value.category,
        address     : this.userForm.value.address,
        description : this.userForm.value.description,
        salary      : this.userForm.value.salary,
        admin       : this.user.admin,
        photo       : this.Userphoto
      };

    await (() => {
        if (this.uploader.queue.length) {
          this.uploader.uploadAll();
          this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            let res: any = JSON.parse(response);
            console.log(res);
            userNewData.photo = res.public_id;
          };
        }
      }
    );

    this.dbapi.push(
      "users",
      userNewData)
      .then(() => this.dbapi.getCurrentUser())
      .then(user => {
        this.authProvider.updateUser(user);
          // currentUser = val;
        console.log("nuevo valor: ", user);
      })
      .then(() => this.backToProfile());
    this.loading.dismiss();
  }


  backToProfile() {
    this.navCtrl.pop();
  }

  //-----------IMG Functions-------------//
  onFileSelected(event: Event) {
    console.log(event);
  }


  logout() {
    this.authProvider.logoutUser()
      .then(() => this.navCtrl.popToRoot());
  }
}
