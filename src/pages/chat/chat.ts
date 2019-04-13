import {AfterViewChecked, Component, ViewChild} from '@angular/core';
import {Content, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import * as firebase from "firebase";
import { DbApiService } from "../../shared/db-api.service";
import * as $ from 'jquery'
import {Subscription} from "rxjs";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage implements AfterViewChecked{
  private user: any;
  private myId: any;
  private inputMessage: string = "";
  private conversation: Subscription;
  messages: any = [];

  @ViewChild(Navbar) navbar: Navbar;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService) {
    this.user = navParams.data;
    this.myId = firebase.auth().currentUser.uid;
  }

  ngAfterViewChecked() {  // sin esto, aparecia un mensaje y hacia scrolltobottom con delay
    this.content.scrollToBottom(0);
  }

  i = 1;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage', this.user);
    this.conversation = this.dbapi.getChat(this.user.id)
      .subscribe(data => {
        // if (this.messages.length > 0) console.log("aaaaaaaaaaaaaa", data);
        this.messages = data;
        // this.events.publish('chats', this.messages);
        this.dbapi.getRangeOfMessages(this.user.id, this.i);
        this.i++;

      });

  }

  ionViewDidLeave() {
    this.conversation.unsubscribe();
  }


  ionViewDidEnter() {
    this.content.scrollToBottom(100);
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
