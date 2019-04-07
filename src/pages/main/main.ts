import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import * as firebase from "firebase";
import {HomePage} from "../home/home";
import {ProfilePage} from "../profile/profile";
import { DbApiService } from "../../shared/db-api.service";
import {MyChatsPage} from "../my-chats/my-chats";
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'page-home',
  templateUrl: 'main.html'
})
export class MainPage {
  private expandOptions = false;
  private isAdmin = false;
  private loading: Loading;

  private home    = HomePage;
  private profile = ProfilePage;
  private login   = LoginPage;
  private myChats = MyChatsPage;
  private page: any;
  icon = faEllipsisV;

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              private toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public dbapi: DbApiService
  ) {
  }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged(user => {
      this.authProvider.isLoggedIn = !!user;
      if (!!user) this.dbapi.getCurrentUser()
        .then(val => this.authProvider.currentUser = val)
        .then(() => console.log("main - user: ", this.authProvider.currentUser)
        );
      console.log("main - user status: ", this.authProvider.isLoggedIn);
      this.expandOptions = true;
    });
  }

  doSomething(src: string) {
    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: src
      });
      toast.present();

      setTimeout(() => toast.dismiss(), 1000);
    }, 100);
  }

  signIn_Out() {
    if (this.authProvider.isLoggedIn) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait",
        spinner: "dots"
      });
      this.loading.present();
      this.authProvider.logoutUser()
        .then(() => {
          this.authProvider.isLoggedIn = false;
          this.authProvider.currentUser = {};
          this.loading.dismiss();
          this.navCtrl.popToRoot();
        });
    } else {
      this.navCtrl.push(
        LoginPage,
        {},
        {
          animate: true,
          direction: 'forward'
        });
    }
  }

  goTo(page: string) {
    switch (page) {
      case "myChats":
        this.page = this.authProvider.isLoggedIn ? this.myChats : this.login;
        break;
      case "profile":
        this.page = this.authProvider.isLoggedIn ? this.profile : this.login;
        break;
      case "home":
        this.page = this.home;
    }

    this.navCtrl.push(
      this.page,
      {},
      {
        animate: true,
        direction: 'forward'
      });
  }
}
