import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { MainPage } from "../main/main";
import * as firebase from "firebase";
import { environment } from "../../environments/environment";
import {ContactListPage} from "../contact-list/contact-list";
import {MCloudinaryPage} from "../m-cloudinary/m-cloudinary";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    firebase.initializeApp(environment.firebase);
  }

  ionViewDidLoad() {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.navCtrl.setRoot(LoginPage);
        unsubscribe();
      } else {
        this.navCtrl.setRoot(MainPage);
        // this.navCtrl.setRoot(MCloudinaryPage);
        unsubscribe();
      }
    });
    console.log('ionViewDidLoad SplashPage');
  }

}
