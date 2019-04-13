import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { User } from "../../shared/model/user";
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
  email_error = false;
  name_error  = false;
  pass_error  = false;
  cPass_error = false;
  email_error_msg: string;
  name_error_msg: string;
  pass_error_msg : string;
  cPass_error_msg: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public loadingCtrl: LoadingController) {
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

    if (user.email == null || user.email.length == 0) {
      this.setError({code: "empty-email"});
    } else if (user.name == null || user.name.length == 0) {
      this.setError({code: "empty-name"})
    } else if (user.name.length < 3) {
      this.setError({code: "short-name"})
    } else if (user.password == null || user.password.length == 0) {
      this.setError({code: "empty-password"});
    } else if (user.password.length < 6) {
      this.setError({code: "auth/weak-password"});
    } else if (user.cPassword == null || user.cPassword.length == 0 || user.cPassword !== user.password) {
      this.setError({code: "empty-cPassword"});
    } else {

      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.authProvider.signupUser(user.email, user.password, user.name)
        .catch(
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
    this.name_error  = false;
    this.pass_error  = false;
    this.cPass_error = false;

    switch (err.code) {
      case "auth/email-already-in-use":
        this.email_error = true;
        this.email_error_msg = 'Oops. The email address is already in use';
        break;
      case "auth/invalid-email":
        this.email_error = true;
        this.email_error_msg = 'An email... you remember how it is?';
        break;
      case "empty-name":
        this.name_error = true;
        this.name_error_msg = 'Do not have a name? :(';
        break;
      case "short-name":
        this.name_error = true;
        this.name_error_msg = 'That\'s all? Use more letters';
        break;
      case "empty-email":
        this.email_error = true;
        this.email_error_msg = 'Write something...';
        break;
      case "empty-password":
        this.pass_error = true;
        this.pass_error_msg = 'Maybe you need a password...';
        break;
      case "auth/weak-password":
        this.pass_error = true;
        this.pass_error_msg = 'Maybe you need a LONGER password...';
        break;
      case "empty-cPassword":
        this.cPass_error = true;
        this.cPass_error_msg = 'Just write the same as before';
    }

    this.setFocusOnError();
  }

  setFocusOnError() {
    let errorFocused : any;
    if (this.cPass_error) errorFocused = <HTMLInputElement>document.querySelector('.cPassword input');
    if (this.pass_error)  errorFocused = <HTMLInputElement>document.querySelector('.password input');
    if (this.name_error)  errorFocused = <HTMLInputElement>document.querySelector('.name input');
    if (this.email_error) errorFocused = <HTMLInputElement>document.querySelector('.email input');
    if (errorFocused != null) errorFocused.focus();
  }
}
