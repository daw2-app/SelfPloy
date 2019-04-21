import {Injectable} from '@angular/core';
import {DbApiService} from "../../shared/db-api.service";
import {Events, ToastController} from "ionic-angular";
import * as _ from "lodash"
import {NetworkProvider} from "../network/network";
import {UserSettingsProvider} from "../user-settings/user-settings";
import {Subscription} from "rxjs";

/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageServiceProvider {

  static chats: any = [];
  static chatSubscription : Subscription;


  constructor(public dbapi      : DbApiService,
              private events    : Events,
              private settings  : UserSettingsProvider,
              private toastCtrl : ToastController) {
    console.log('Hello MessageServiceProvider Provider');
  }


  async startChatListObserver() {

    console.log('message provider: loading chatlist from local database');
    await this.getFromLocalDataBase();
    let user;
    await this.settings.getCurrentUser().then(value => user = value)

    NetworkProvider.networkStatus.subscribe({
      next: available => {
        if (available) {
          console.log('message provider: loading chatlist from internet');
          if (user) this.getFromInternet(user.uid);
        }
      }
    });

  }


  getFromInternet(userId: string) {
    let userChatsSubscription = this.dbapi.getListOfMyChats(userId);

    console.log('interneeeeet 1')
    // evitar multiples suscripciones
    console.log('interneeeeet 2', userChatsSubscription);
    if (userChatsSubscription && MessageServiceProvider.chatSubscription == null) {
      MessageServiceProvider.chatSubscription = userChatsSubscription
        .subscribe(data => {
            data.then(chat => {

              // this.showNotification(chat.name, chat.lastMsgText)

              // para evitar duplicar mensajes
              let i = _.findIndex(MessageServiceProvider.chats, ['id', chat.id]);

              // if (i == -1 || chat.lastMsgTimestamp != MessageServiceProvider.chats[i].lastMsgTimestamp) {
              //   console.log('index', i, chat.lastMsgTimestamp, MessageServiceProvider.chats[i].lastMsgTimestamp)
              //   this.showNotification(chat.name, chat.lastMsgText)
              // }

              if (i != -1) MessageServiceProvider.chats.splice(i, 1);
              MessageServiceProvider.chats.push(chat);
              // para poner los mensajes primeros arriba
              MessageServiceProvider.chats = _.orderBy(
                MessageServiceProvider.chats,
                ['lastMsgTimestamp'], ['desc']);
              this.events.publish('chatList', MessageServiceProvider.chats);
            });
          }
        )
    }
  }


  showNotification(from: string, text: string) {
    this.toastCtrl.create({
      message         : 'Mensaje de ' + from + '\n' + text,
      // duration : 1000,
      position        : 'top',
      cssClass        : 'pushNotification',
      showCloseButton : true
    }).present();
  }


  getFromLocalDataBase() {
    this.settings.getChatList()
      .then(value => MessageServiceProvider.chats = value)
      .then(() => this.events.publish('chatList', MessageServiceProvider.chats))
    ;
  }


  getChat(otherUserId: string) {

    NetworkProvider.networkStatus.subscribe({
      next: available => {
        if (available) {
          console.log('loading chat from internet');
          this.dbapi.getChat(otherUserId);
        } else {
          console.log('loading chat from local database');
          this.getChatFromLocalDataBase(otherUserId);
        }
      }
    });

  }

  getChatFromLocalDataBase(otherUserId: string) {
    this.settings.getChat(otherUserId)
      .then(messages => {
        for (let message of messages) {
          console.log('message', message);
          this.events.publish('chat', message);
        }
      })
    ;
  }

  unsuscribeChatList() {
    if (MessageServiceProvider.chatSubscription != null)
      MessageServiceProvider.chatSubscription.unsubscribe();
    MessageServiceProvider.chatSubscription = null;
  }
}
