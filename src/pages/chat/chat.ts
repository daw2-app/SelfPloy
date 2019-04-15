import {AfterViewChecked, Component, ViewChild} from '@angular/core';
import {Content, IonicPage, Navbar, NavController, NavParams, ScrollEvent} from 'ionic-angular';
import * as firebase from "firebase";
import {DbApiService} from "../../shared/db-api.service";
import * as $ from 'jquery'
import {fromEvent, Observable, Subscription} from "rxjs";
import {debounceTime, first} from "rxjs/operators";

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

  private user: any;
  private myId: any;
  private inputMessage: string = "";
  private nearBottomPage = true;

  private conversation: Subscription;
  private startWriting: Subscription;
  private stopWriting: Subscription;

  private messages: any = [];
  private anotherUserIsTyping = true;

  @ViewChild(Navbar) navbar: Navbar;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService) {
    this.user = navParams.data;
    this.myId = firebase.auth().currentUser.uid;
  }

  ngAfterViewChecked() {  // si no lo colocaba aqui, aparecia un mensaje y hacia scrolltobottom con delay
    if (this.nearBottomPage) this.scrollToBottom();
  }

  logScrolling($event: ScrollEvent) {
    let scrollHeight =    document.querySelector('page-chat > ion-content > div.scroll-content').scrollHeight;
    let currentScroll =   this.content.contentHeight + $event.scrollTop;
    this.nearBottomPage = currentScroll > scrollHeight - 20;
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

  ionViewDidEnter() {
    // this.content.scrollToBottom(0);
    this.navbar.backButtonClick = () => this.navCtrl.pop(
      {
        animate:   true,
        animation: "transition-ios"
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage', this.user);

    this.handleMyWritingStatus();

    this.conversation = this.dbapi.getChat(this.user.id)
      .subscribe(data => {
        console.log("data: ", data.val());

        if (typeof data.val() !== "boolean") this.messages.push(data.val());
        else this.anotherUserIsTyping = data.val();

        // this.events.publish('chats', this.messages);
        // this.dbapi.getRangeOfMessages(this.user.id, this.i);
        // this.i++;

      });
  }

  ionViewDidLeave() {
    this.sendWritingStatus(false);
    this.conversation.unsubscribe();
    this.startWriting.unsubscribe();
    this.stopWriting.unsubscribe();
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
      text:      this.inputMessage,
      from:      this.myId,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    this.inputMessage = "";
    this.sendWritingStatus(false);
    this.handleMyWritingStatus();

    this.dbapi.pushMessage(newMessage, this.myId, this.user.id);
  }

  sendWritingStatus(writing: boolean) {
    this.dbapi.push(
      `chats/${this.user.id}/${this.myId}`,
      writing,
      "typing");
  }

  messageTapped(message: any) {
    console.log(message);
  }
}
