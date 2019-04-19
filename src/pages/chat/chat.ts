import {AfterViewChecked, Component, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, Navbar, NavController, NavParams, ScrollEvent} from 'ionic-angular';
import * as firebase from "firebase";
import {DbApiService} from "../../shared/db-api.service";
import * as $ from 'jquery';
import * as _ from 'lodash';
import {fromEvent, Observable, Subscription} from "rxjs";
import {debounceTime, first} from "rxjs/operators";
import {UserSettingsProvider} from "../../providers/user-settings/user-settings";
import {MessageServiceProvider} from "../../providers/message-service/message-service";
import {ChatListPage} from "../chat-list/chat-list";

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
export class ChatPage implements AfterViewChecked {

  private anotherUserName     : string;
  private anotherUserId       : string;
  private myId                : string;
  private inputMessage        = "";
  private messages            = [];
  private messagesNotReaded   = 0;
  private anotherUserIsTyping = false;
  private nearToBottom        = true;

  private startWriting : Subscription;
  private stopWriting  : Subscription;


  @ViewChild(Navbar) navbar   : Navbar;
  @ViewChild(Content) content : Content;

  constructor(public navCtrl      : NavController,
              public navParams    : NavParams,
              public dbapi        : DbApiService,
              private events      : Events,
              private messagesApi : MessageServiceProvider) {
    this.anotherUserName = navParams.data.name;
    this.anotherUserId   = navParams.data.id;
    this.myId            = firebase.auth().currentUser.uid;
  }


  ngAfterViewChecked() {  // si no lo colocaba aqui, aparecia un mensaje y hacia scrolltobottom con delay
    if (this.nearToBottom) this.scrollToBottom();
  }


  logScrolling($event: ScrollEvent) {
    let scrollHeight  = document.querySelector('page-chat > ion-content > div.scroll-content').scrollHeight;
    let currentScroll = this.content.contentHeight + $event.scrollTop;
    this.nearToBottom = currentScroll > scrollHeight - 20;
  }


  scrollToBottom() {
    this.content.scrollToBottom(0);
  }


  ionViewDidEnter() {
    this.navbar.backButtonClick = () => this.navCtrl.pop(
      {
        animate:   true,
        animation: "transition-ios"
      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage - chating with', this.navParams.data);

    let chat = _.find(MessageServiceProvider.chats, ['id', this.anotherUserId]);
    this.messagesNotReaded = chat != null? chat.notReaded : 0;

    this.handleMyWritingStatus();

    this.events.subscribe('chat', message => {

        if (message != null) {

          if (typeof message !== "boolean") {
            if (!message.readed) this.dbapi.markAsRead(this.anotherUserId, message.id);
            let notExists = _.findIndex(this.messages, ['id', message.id]) < 0;
            if (notExists) this.messages.push(message);

          } else {
            this.anotherUserIsTyping = message;
            console.log("writing: ", message);
          }
        }
      }
    );

    this.messagesApi.getChat(this.anotherUserId);
  }


  ionViewDidLeave() {
    this.sendWritingStatus(false);
    try {
      this.startWriting.unsubscribe();
      this.stopWriting.unsubscribe();
      this.events.unsubscribe('chat');
    } catch (ignored) { }
  }


  handleMyWritingStatus() {
    const inputChat = fromEvent($('page-chat > ion-footer ion-input > input'), 'keyup');

    try {
      this.startWriting.unsubscribe();
      this.stopWriting.unsubscribe();
    } catch (ignored) { }

    this.startWriting = inputChat
      .pipe(first())
      .subscribe(() => {
          this.startWriting.unsubscribe();
          this.sendWritingStatus(true)
        }
      );

    this.stopWriting = inputChat
      .pipe(debounceTime(2000))
      .subscribe(() => {
        this.sendWritingStatus(false);
        this.startWriting = inputChat
          .pipe(first())
          .subscribe(() => this.sendWritingStatus(true));
      });
  }


  sendMessage() {
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      from:      this.myId,
      readed:    false,
      text:      this.inputMessage
    };

    this.inputMessage = "";
    this.sendWritingStatus(false);
    this.handleMyWritingStatus();

    this.dbapi.pushMessage(newMessage, this.myId, this.anotherUserId);
  }


  sendWritingStatus(writing: boolean) {
    this.dbapi.push(
      `chats/${this.anotherUserId}/${this.myId}`,
      writing,
      "typing");
  }


  messageTapped(message: any) {
    console.log(message);
  }

}
