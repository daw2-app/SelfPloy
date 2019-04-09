import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import * as firebase from "firebase";
import { DbApiService } from "../../shared/db-api.service";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  private user: any;
  private myId: any;
  private inputMessage: string;
  messages: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService) {
    this.user = navParams.data;
    this.myId = firebase.auth().currentUser.uid;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChatPage', this.user);
    this.dbapi.getChat(this.user.id)
      .subscribe(data => {
        this.messages = data
      });
  }

  @ViewChild(Navbar) navbar: Navbar;

  ionViewDidEnter() {
    this.navbar.backButtonClick = () => this.navCtrl.pop(
      {
        animate: true,
        animation: "transition-ios"
      });

  }

  sendMessage() {
    const newMessage = {
      text     : this.inputMessage,
      from     : this.myId,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    this.dbapi.pushMessage(newMessage, this.myId, this.user.id)
      .then(() => this.inputMessage = "");
  }

  messageTapped(message: any) {
    console.log(message);
  }
}
