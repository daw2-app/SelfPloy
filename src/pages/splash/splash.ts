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
import {StatusBar} from "@ionic-native/status-bar";

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
  static toast: Toast;
  private authObserver: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public authProvider: AuthProvider,
              public dbapi: DbApiService,
              private settings: UserSettingsProvider,
              public events: Events,
              public network: Network,
              public networkProvider: NetworkProvider,
              public toastCrtl: ToastController) {
    // firebase.initializeApp(environment.firebase);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');

    this.loading = this.loadingCtrl.create({
      content: "Doing a magic trick",
      spinner: "dots"
    });
    this.loading.present();

    this.networkObserver();
    this.getUserIfExistsAndContinue();
  }


  async getUserIfExistsAndContinue() {

    if (NetworkProvider.beta) { // en un ordenador no funciona
      this.authChangedObserver()

    } else {
      if (this.network.type == null || this.network.type == 'none') {
        // no hay internet, tiramos de local
        console.log('network:' + 'what?!');
        this.loadUserFromLocal();
      } else {
        // hay internet, tiramos de internet
        console.log('network:' + 'Habemus internet');
        this.authChangedObserver()
      }
    }

  }


  async loadUserFromLocal(){
    console.log('network:' + 'Where has the internet gone?');
    let userLocal: any;
    await this.settings.getCurrentUser().then(value => userLocal = value);
    console.log('storage', userLocal ? userLocal : 'nope');
    if (userLocal) this.authProvider.currentUser = userLocal;
    this.goHomeLikeABoss(true);
  }


  authChangedObserver() {
    this.authObserver = firebase.auth().onAuthStateChanged(user => {

      const activeView = this.navCtrl.getActive().name;

      if (user) {
        this.updateLastLogin();
        this.dbapi.getCurrentUser()
          .then(val => this.authProvider.currentUser = val);
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
          if (this.authObserver) this.authChangedObserver();

        } else {      // Offline
          SplashPage.toast = this.toastCrtl.create(
            {
              message: 'Where has the internet gone?',
              cssClass: 'networkToast'
            }
          );

          SplashPage.toast.present();
        }

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
