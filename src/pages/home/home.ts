import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AuthProvider } from "../../providers/auth/auth";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider) {

  }

  signOut() {
    this.authProvider.logoutUser()
      .then(() => this.navCtrl.setRoot(
        LoginPage,
        {},
        {
          animate: true,
          direction: 'back'
        }));
  }
}
