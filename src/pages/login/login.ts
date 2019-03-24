import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { HomePage } from "../home/home";
import { RegisterPage } from "../register/register";
import { User } from "../../shared/model/user";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private user: User = {} as User;
  private loading: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public loadingCtrl: LoadingController,
              public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
  }

  login(user: User) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.authProvider.loginUser(user.email, user.password)
      .then(() => {
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(
            HomePage,
            {},
            {
              animate: true,
              direction: 'forward'
            });
        })
      });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }
}
