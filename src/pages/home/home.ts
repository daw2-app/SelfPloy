import { Component } from '@angular/core';
import { IonicPage, ItemSliding, Loading, LoadingController, NavController, NavParams, Refresher, ToastController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AuthProvider } from "../../providers/auth/auth";
import { DbApiService } from "../../shared/db-api.service";
import {RegisterPage} from "../register/register";
import {ProfileEditPage} from "../profile-edit/profile-edit";
import {UserDetailPage} from "../user-detail/user-detail";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: Loading;
  users: any = [];


  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              public dbapi: DbApiService,
              public loadingCtrl: LoadingController,
              ) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.showUsers()
      .then(() => this.loading.dismiss());

    console.log("user status: ", this.authProvider.isLoggedIn)
  }

  showUsers() {
    return this.dbapi.getListOf("users")
      .then((snapshot) => {
        for (let k in snapshot) {
          this.users.push({
            id: k,
            name: snapshot[k].name,
            lastName: snapshot[k].lastName,
            category: snapshot[k].category,
            description: snapshot[k].description,
            salary: snapshot[k].salary
          })
        }
      });
  }
  userDetail(user){
    this.navCtrl.push(UserDetailPage,user);
  }

}
