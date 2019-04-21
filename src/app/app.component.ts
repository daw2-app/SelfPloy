import { Component } from '@angular/core';
import {Events, LoadingController, NavController, NavParams, Platform, Toast, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {NetworkProvider} from "../providers/network/network";
import {UserSettingsProvider} from "../providers/user-settings/user-settings";
import { AuthProvider } from "../providers/auth/auth";
import {DbApiService} from "../shared/db-api.service";
import {Network} from "@ionic-native/network";
import * as firebase from "firebase";
import { MessageServiceProvider } from "../providers/message-service/message-service";
import {CategoriesProvider} from "../providers/categories/categories";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  static toast : Toast;
  private authObserver : any;

  constructor(platform         : Platform,
              statusBar        : StatusBar,
              splashScreen     : SplashScreen,
              // private navCtrl         : NavController,
              // private navParams       : NavParams,
              private loadingCtrl      : LoadingController,
              private authProvider     : AuthProvider,
              private dbapi            : DbApiService,
              private settings         : UserSettingsProvider,
              private messagesProvider : MessageServiceProvider,
              private events           : Events,
              private network          : Network,
              private networkProvider  : NetworkProvider,
              private toastCrtl        : ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.overlaysWebView(false);
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#fff");
      splashScreen.hide();
      this.loadConfig();
    });
  }

  private loadConfig() {
    let loading = this.loadingCtrl.create(
      {
        content: 'Doing a magic trick',
        spinner: 'dots'
      }
    );
    loading.present();

    this.networkObserver();
    this.getUserIfExistsAndContinue()
      .then(() => this.messagesProvider.startChatListObserver())
      .then(() => {
          this.rootPage = TabsPage;
          loading.dismiss()
        }
      );

      // .then(() => this.rootPage = TabsPage)
  }


  async getUserIfExistsAndContinue() {

    // if (NetworkProvider.beta) { // en un ordenador no funciona bien
    //   this.authChangedObserver()

    // } else {
      if (this.network.type == null || this.network.type == 'none') console.log('network:' + 'Where has the internet gone?');
      else console.log('network: Habemus internet');

      await this.loadUserFromLocal();   // primero cargamos al usuario desde local
      this.authChangedObserver()  // luego actualizamos con la red, si se encuentra disponible
    // }

  }


  async loadUserFromLocal(){
    let userLocal: any;
    await this.settings.getCurrentUser().then(value => userLocal = value);
    console.log('storage', userLocal ? userLocal : 'nope');
    if (userLocal) this.authProvider.currentUser = userLocal;
    // this.goHomeLikeABoss(true);
  }


  authChangedObserver() {
    this.authObserver = firebase.auth().onAuthStateChanged(user => {

      console.log('cambio de usuario: ', user)

      // const activeView = this.navCtrl.getActive().name;
      if (user) {
        this.updateLastLogin();
        this.dbapi.getCurrentUser()
          .then(val => {
            this.authProvider.currentUser = val;
            this.settings.login(val);
          });
        // if (activeView === 'RegisterPage' ||
        //   activeView === 'LoginPage'    ||
        //   activeView === 'SplashPage') this.goHomeLikeABoss();

      }
      // else {
      //   if (activeView === 'SplashPage') {
        //   this.authProvider.currentUser = null;
        //   this.goHomeLikeABoss();
        // }
      // }

    });
  }


  networkObserver() {
    this.networkProvider.initializeNetworkEvents();

    NetworkProvider.networkStatus.subscribe({
      next: status => {

        if (status) { // Online
          this.getCountOfUsers();
          if (MyApp.toast != null) {
            document.querySelector('.networkToast .toast-container')
              .classList.add('noise');
            document.querySelector('.networkToast .toast-container .toast-message')
              .innerHTML = 'Oh! Is there';

            setTimeout(() => {
              MyApp.toast.dismiss()
                .then(() => MyApp.toast = null);
            }, 2000);

          }
          if (this.authObserver != null) this.authChangedObserver();

        } else {      // Offline
          MyApp.toast = this.toastCrtl.create(
            {
              message: 'Where has the internet gone?',
              cssClass: 'networkToast'
            }
          );

          MyApp.toast.present();
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


  getCountOfUsers() {
    CategoriesProvider.categories.forEach( category => {
      this.dbapi.getCountOfUsers(category.filter)
    .then(value => category.count = value);
    })
  }
}
