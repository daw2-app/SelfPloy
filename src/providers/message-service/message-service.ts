import {Injectable} from '@angular/core';
import {DbApiService} from "../../shared/db-api.service";
import {Events} from "ionic-angular";
import * as _ from "lodash"
import {NetworkProvider} from "../network/network";
import {UserSettingsProvider} from "../user-settings/user-settings";

/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageServiceProvider {

  static chats: any = [];


  constructor(public dbapi: DbApiService,
              private events: Events,
              private settings: UserSettingsProvider) {
    console.log('Hello MessageServiceProvider Provider');
  }


  startChatListObserver() {

    NetworkProvider.networkStatus.subscribe({
      next: available => {
        if (available) {
          console.log('loading chatlist from internet');
          this.getFromInternet();
        } else {
          console.log('loading chatlist from local database');
          this.getFromLocalDataBase();
        }
      }
    });

  }


  getFromInternet() {
    // tardaba en cargar los chats. mejorar experiencia de usuario
    let userChats = this.dbapi.getListOfMyChats();

    if (userChats) {
      userChats
        .subscribe(data => {
            data.then(chat => {
              // para poner el mensaje nuevo en el top de la lista
              let i = _.findIndex(MessageServiceProvider.chats, ['id', chat.id]);
              if (i != -1 && chat.lastMsgTimestamp != MessageServiceProvider.chats.lastMsgTimestamp)
                MessageServiceProvider.chats.splice(i, 1);
              MessageServiceProvider.chats.push(chat);
              MessageServiceProvider.chats = _.orderBy(
                MessageServiceProvider.chats,
                ['lastMsgTimestamp'], ['desc']);
              this.events.publish('chatList', MessageServiceProvider.chats);
            });
          }
        )
    }
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
}
