import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { LoginPage } from "../login/login";
import { MainPage } from "../main/main";
import * as firebase from "firebase";
import { environment } from "../../environments/environment";
import {ContactListPage} from "../contact-list/contact-list";
import {MCloudinaryPage} from "../m-cloudinary/m-cloudinary";
import {AuthProvider} from "../../providers/auth/auth";
import {DbApiService} from "../../shared/db-api.service";

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  private loading: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public authProvider: AuthProvider,
              public dbapi: DbApiService) {
    // firebase.initializeApp(environment.firebase);
  }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged(user => {
      this.loading = this.loadingCtrl.create({
        content: "Doing a magic trick",
        spinner: "dots"
      });
      this.authProvider.isLoggedIn = !!user;
      this.loading.present();
      if (!!user) this.dbapi.getCurrentUser()
        .then(val => this.authProvider.currentUser = val)
        .then(() => console.log("splash - user: ", this.authProvider.currentUser))
        .then(() =>
          this.dbapi.push(
            `users/${firebase.auth().currentUser.uid}`,
            firebase.database.ServerValue.TIMESTAMP,
            "lastLogin"))
        .then(() => this.loading.dismiss())
        .then(() => this.navCtrl.setRoot(
          MainPage,
          {},
          {
            animate: true,
            direction: 'back'
          })
        );
      else this.navCtrl.setRoot(MainPage).then(() => this.loading.dismiss());


    });
    console.log('ionViewDidLoad SplashPage');
  }

}
