import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from "firebase";


import { SplashPage } from "../pages/splash/splash";
import {MainPage} from "../pages/main/main";
import {environment} from "../environments/environment";
import {ChatPage} from "../pages/chat/chat";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = MainPage;
  // rootPage:any = ChatPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    firebase.initializeApp(environment.firebase);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

