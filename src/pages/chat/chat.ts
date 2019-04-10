import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import * as firebase from "firebase";
import { DbApiService } from "../../shared/db-api.service";
import * as $ from 'jquery'
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fromEvent} from "rxjs";

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
export class ChatPage {
  private user: any;
  private myId: any;
  private inputMessage: string = "";
  private disable: boolean;
  private chatForm : FormGroup;
  messages: any;

  @ViewChild(Navbar) navbar: Navbar;
  @ViewChild(Content) content: Content;
  paco = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService,
              private formBuilder: FormBuilder) {
    this.user = navParams.data;
    this.myId = firebase.auth().currentUser.uid;
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChatPage', this.user);
    this.dbapi.getChat(this.user.id)
      .subscribe(data => {
        this.messages = data;
        this.content.scrollToBottom(100);
      });
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
