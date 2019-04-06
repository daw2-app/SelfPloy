import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import * as firebase from "firebase";
import {environment} from "../../environments/environment";
import {ContactListPage} from "../contact-list/contact-list";


@Component({
  selector: 'page-home',
  templateUrl: 'main.html'
})
export class MainPage {
  private expandOptions = false;
  private isAdmin = false;
  private isLoggedIn: boolean;
  private loading: Loading;


  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              private toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged(user => {
      this.isLoggedIn = !!user;
      this.expandOptions = true;
    });
  }

  doSomething(src: string) {
    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: src
      });
      toast.present();

      setTimeout(() => toast.dismiss(), 1000);
    }, 100);
  }

  signIn_Out() {
    if (this.isLoggedIn) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        spinner: "dots"
      });
      this.loading.present();
      this.authProvider.logoutUser()
        .then(() => {
          this.navCtrl.popToRoot();
          this.isLoggedIn = false;
        })
        .then(() => this.loading.dismiss());
    } else {
      this.navCtrl.push(
        LoginPage,
        {},
        {
          animate: true,
          direction: 'forward'
        });
    }
  }

  goHome() {
    this.navCtrl.push(
      HomePage,
      {},
      {
        animate: true,
        direction: 'forward'
      });
  }
}
