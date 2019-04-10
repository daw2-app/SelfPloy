import {Component} from '@angular/core';
import {Events, Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import * as firebase from "firebase";
import {HomePage} from "../home/home";
import {ProfilePage} from "../profile/profile";
import { DbApiService } from "../../shared/db-api.service";
import {MyChatsPage} from "../chat-list/chat-list";
import {
  faHammer,
  faLightbulb,
  faLaptop,
  faGavel,
  faShower,
  faKey,
  faPaintRoller
} from '@fortawesome/free-solid-svg-icons';
import {CategoryPage} from "../category/category";


@Component({
  selector: 'page-home',
  templateUrl: 'main.html'
})
export class MainPage {
  private expandOptions = false;
  private expandCategories = false;
  private isAdmin = false;
  private loading: Loading;

  private page: any;
  private chats: any;
  // private chats: any;

  private home     = HomePage;
  private profile  = ProfilePage;
  private login    = LoginPage;
  private myChats  = MyChatsPage;
  private category = CategoryPage;

  private categories = [
    {'name':'hammer',       'icon': faHammer,      'filter': 'carpintero'},
    {'name':'lightbulb',    'icon': faLightbulb,   'filter': 'electricista'},
    {'name':'laptop',       'icon': faLaptop,      'filter': 'informático'},
    {'name':'paint-roller', 'icon': faPaintRoller, 'filter': 'pintor'},
    {'name':'shower',       'icon': faShower,      'filter': 'fontanero'},
    {'name':'key',          'icon': faKey,         'filter': 'cerrajero'}
  ];

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              private toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public dbapi: DbApiService,
              private events: Events) {
  }

  ionViewDidLoad() {
    setTimeout(() => this.expandOptions = true, 500);

    // tardaba en cargar los chats. mejorar experiencia de usuario
    let userChats = this.dbapi.getListOfMyChats();

    if (userChats) {
      this.dbapi.getListOfMyChats()
        .subscribe(data => {
          // cuando se cumplan todas las promesas
          // (porque devuelve un array de promesas) entonces...
          Promise.all(data)
            .then(data => this.chats = data)
            .then(() => this.events.publish('chats', this.chats))
        });
    }
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

  goTo(page: string, params?: string) {

    switch (page) {
      case "myChats":
        this.page = this.authProvider.isLoggedIn ? this.myChats : this.login;
        params = this.chats;
        break;
      case "profile":
        this.page = this.authProvider.isLoggedIn ? this.profile : this.login;
        break;
      case "home":
        this.page = this.home;
        break;
      case "category":
        this.page = this.category;
    }

    this.navCtrl.push(
      this.page,
      params,
      {
        animate: true,
        direction: 'forward'
      });
  }
}
