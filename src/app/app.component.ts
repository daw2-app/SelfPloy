import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from "firebase";


import { SplashPage } from "../pages/splash/splash";
import {environment} from "../environments/environment";
import {DbApiService} from "../shared/db-api.service";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = SplashPage;
  // rootPage: any = LoginPage;
  // rootPage: any = MainPage;

  private sub1$:any;
  private sub2$:any;

  constructor(private platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private dbapi: DbApiService
  ) {


    // Firebase App named '[DEFAULT]' already exists (app/duplicate-app)
    if (!firebase.apps.length) firebase.initializeApp(environment.firebase);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.updateLastLogin();
    });
  }

  ionViewWillUnload() {
    this.sub1$.unsubscribe();
    this.sub2$.unsubscribe();
  }

  updateLastLogin() {
    this.sub1$ = this.platform.pause.subscribe(() => {
      console.log('****UserdashboardPage PAUSED****');
    });
    this.sub2$ = this.platform.resume.subscribe(() => {
      console.log('****UserdashboardPage RESUMED****');
      let currentUser;
      if ((currentUser = firebase.auth().currentUser) != null)
        this.dbapi.push(
          `users/${currentUser.uid}`,
          firebase.database.ServerValue.TIMESTAMP,
          "lastLogin")
          .then(value => console.log('firebase - todo guay: ', value))
          .catch(value => console.log('firebase - oops: ', value))
    });
  }
}

