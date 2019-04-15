import {Component} from '@angular/core';
import {Events, Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import * as firebase from "firebase";
import * as _ from "lodash"
import {HomePage} from "../home/home";
import {ProfilePage} from "../profile/profile";
import { DbApiService } from "../../shared/db-api.service";
import {ChatListPage} from "../chat-list/chat-list";
import {
  faHammer,
  faLightbulb,
  faLaptop,
  faShower,
  faKey,
  faPaintRoller
} from '@fortawesome/free-solid-svg-icons';
import {CategoryPage} from "../category/category";
import {MessageServiceProvider} from "../../providers/message-service/message-service";


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
  private chats: any = [];
  // private chats: any;

  private home     = HomePage;
  private profile  = ProfilePage;
  private login    = LoginPage;
  private chatList = ChatListPage;
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
              private messageService : MessageServiceProvider,
              private events: Events) {
  }

  ionViewDidLoad() {
    // this.events.subscribe('chatList');
    new MessageServiceProvider(this.dbapi, this.events).startChatListObserver();
    setTimeout(() => this.expandOptions = true, 500);
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
      case "chatList":
        this.page = this.authProvider.isLoggedIn ? this.chatList : this.login;
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
