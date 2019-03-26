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
  email_error = false;
  pass_error  = false;
  cPass_error = false;
  email_error_msg: string;
  pass_error_msg : string;
  cPass_error_msg: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public loadingCtrl: LoadingController,
              public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
  }

  login(user: User) {
    if (user.email == null || user.email.length == 0) {
      this.setError({code: "empty-email"});
    } else if (user.password == null || user.password.length == 0) {
      this.setError({code: "empty-password"});
    } else if (user.password.length < 6) {
      this.setError({code: "weak-password"});
    } else {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.authProvider.loginUser(user.email, user.password)
        .then(() => {
            this.navCtrl.setRoot(
              HomePage,
              {},
              {
                animate: true,
                direction: 'forward'
              });
          },
          (err) => {
            this.setError(err);
          })
        .then(() => this.loading.dismiss())
        .then(() => this.setFocusOnError());
    }
  }

  setError(err: any) {

    console.log('error -> ', err);

    this.email_error = false;
    this.pass_error  = false;
    this.cPass_error = false;

    switch (err.code) {
      case "auth/invalid-email":
        this.email_error = true;
        this.email_error_msg = 'An email... you remember how it is?';
        break;
      case "empty-email":
        this.email_error = true;
        this.email_error_msg = 'Write something like... an email?';
        break;
      case "auth/user-not-found":
        this.email_error = true;
        this.email_error_msg = 'Nothing here. Are you sure?';
        break;
      case "empty-password":
        this.pass_error = true;
        this.pass_error_msg = 'Wait! your password';
        break;
      case "weak-password":
        this.pass_error = true;
        this.pass_error_msg = 'Uhm... it was longer';
        break;
      case "auth/wrong-password":
        this.pass_error = true;
        this.pass_error_msg = 'Uh-oh... Try again!';
    }

    this.setFocusOnError();
  }

  setFocusOnError() {
    let errorFocused : any;
    if (this.cPass_error) errorFocused = <HTMLInputElement>document.querySelector('.cPassword input');
    if (this.pass_error) errorFocused  = <HTMLInputElement>document.querySelector('.password input');
    if (this.email_error) errorFocused = <HTMLInputElement>document.querySelector('.email input');
    if (errorFocused != null) errorFocused.focus();
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }
}
