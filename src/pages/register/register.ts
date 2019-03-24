import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from "../../shared/model/user";
import { HomePage } from "../home/home";
import { AuthProvider } from "../../providers/auth/auth";



/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private user: User = {} as User;
  private loading: Loading;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public loadingCtrl: LoadingController,
              public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  backToLogin() {
    if (this.navCtrl.canGoBack()) this.navCtrl.pop();
    else this.navCtrl.push(LoginPage,
      {},
      {
        animate: true,
        direction: 'back'
      });
  }

  signUp(user: User) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.authProvider.signupUser(user.email, user.password)
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
      })
  }
}
