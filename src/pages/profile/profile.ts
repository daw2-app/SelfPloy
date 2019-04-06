import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { DbApiService } from "../../shared/db-api.service";
import { AuthProvider } from "../../providers/auth/auth";
import {ProfileEditPage} from "../profile-edit/profile-edit";


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private user: any;
  private loading: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService,
              private toastCtrl: ToastController,
              public authProvider: AuthProvider,
              public loadingCtrl: LoadingController
              ) {

  }

  ionViewWillEnter(){
    this.loading = this.loadingCtrl.create({
      content: "Loading profile",
      spinner: "dots"
    });
    this.dbapi.getCurrentUser()
      .then((value) => this.user = value);
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  modifyProfile(user){
    this.navCtrl.push(ProfileEditPage,user);
  }
}
