import { Component } from '@angular/core';
import {
  Events,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams,
  Toast,
  ToastController
} from 'ionic-angular';
import { MainPage } from "../main/main";
import * as firebase from "firebase";
import * as $ from "jquery";
import {AuthProvider} from "../../providers/auth/auth";
import {DbApiService} from "../../shared/db-api.service";
import { UserSettingsProvider } from "../../providers/user-settings/user-settings";
import { Network } from '@ionic-native/network';
import { NetworkProvider } from "../../providers/network/network";
import { MessageServiceProvider } from "../../providers/message-service/message-service";

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

  private loading      : Loading;
  static toast         : Toast;
  private authObserver : any;

  constructor(private navCtrl         : NavController,
              private navParams       : NavParams,
              private loadingCtrl     : LoadingController,
              private authProvider    : AuthProvider,
              private dbapi           : DbApiService,
              private settings        : UserSettingsProvider,
              private events          : Events,
              private network         : Network,
              private networkProvider : NetworkProvider,
              private toastCrtl       : ToastController,
              private msgProvider     : MessageServiceProvider) {
    // firebase.initializeApp(environment.firebase);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');

    this.loading = this.loadingCtrl.create({
      content: "Doing a magic trick",
      spinner: "dots"
    });

    this.loading.present();
    this.loadUserDataFromLocal()
      .then(() => this.networkObserver());
  }


  async loadUserDataFromLocal(){
    let userLocal: any;
    await this.settings.getCurrentUser()
      .then(value => userLocal = value);
    console.log('storage', userLocal ? userLocal : 'nope');
    if (userLocal) {
      this.authProvider.currentUser = userLocal;
      this.msgProvider.preloadChats();
    }
  }


  authChangedObserver() {
    this.authObserver = firebase.auth().onAuthStateChanged(user => {

      const activeView = this.navCtrl.getActive().name;

      if (user) {
        this.updateLastLogin();
        this.dbapi.getCurrentUser()
          .then(val => this.authProvider.currentUser = val);
        this.settings.checkDeletePendingMessages()
          .then(messages => this.dbapi.removeMessages(messages))
          .then(() => this.msgProvider.startChatListObserver());
        if (activeView === 'RegisterPage' ||
            activeView === 'LoginPage'    ||
            activeView === 'SplashPage') this.goHomeLikeABoss(true);

      } else {

        if (activeView === 'SplashPage') {
          this.authProvider.currentUser = null;
          this.goHomeLikeABoss(true);
        }
      }

    });
  }


  networkObserver() {
    this.networkProvider.initializeNetworkEvents();

    NetworkProvider.networkStatus.subscribe({
      next: status => {

        if (status) { // Online
          if (SplashPage.toast != null) {
            document.querySelector('.networkToast .toast-container')
              .classList.add('noise');
            document.querySelector('.networkToast .toast-container .toast-message')
              .innerHTML = 'Oh! Is there';

            setTimeout(() => {
              SplashPage.toast.dismiss()
                .then(() => SplashPage.toast = null);
            }, 2000);
          }
          this.settings.checkDeletePendingMessages()
            .then(messages => this.dbapi.removeMessages(messages));

        } else {      // Offline
          if (SplashPage.toast != null) SplashPage.toast.dismiss();
          SplashPage.toast = this.toastCrtl.create(
            {
              message: 'Where has the internet gone?',
              cssClass: 'networkToast'
            }
          );

          SplashPage.toast.present();
        }

        if (this.authObserver == null) this.authChangedObserver();
      }
    });
  }


  updateLastLogin() {
    this.dbapi.push(
      `users/${firebase.auth().currentUser.uid}`,
      firebase.database.ServerValue.TIMESTAMP,
      "lastLogin");
  }


  goHomeLikeABoss(animate: boolean) {
    this.navCtrl.setRoot(
      MainPage,
      {},
      {
        animate: animate,
        direction: 'back'
      })
      .then(() => this.loading.dismiss());
  }

}
