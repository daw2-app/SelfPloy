import {Injectable} from '@angular/core';
import {DbApiService} from "../../shared/db-api.service";
import {NetworkProvider} from "../network/network";
import {UserSettingsProvider} from "../user-settings/user-settings";
import {Subscription} from "rxjs";
import * as _ from 'lodash'
import {Events} from "ionic-angular";

/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageServiceProvider {

  static chats = [];
  chatsPreloaded = false;
  chatsSuscription : Subscription;


  constructor(public dbapi:    DbApiService,
              public events:   Events,
              public settings: UserSettingsProvider) {
    console.log('Hello MessageServiceProvider Provider');
  }


  startChatListObserver() {

    NetworkProvider.networkStatus.subscribe({
      next: available => {
        if (available) {
          console.log('loading chatlist from internet');
          if (this.chatsSuscription == null) this.chatsSuscription = this.dbapi.getChats()
            .subscribe(async value => {

              // al eliminar se activaba el evento y se volvia a aparecer"
              if (value.type != "child_removed") {
                // el typing llega antes que los mensajes y puede recoger solo ese
                if (_.size(value.payload.val()) > 1) {

                  let userName: string;
                  await this.dbapi.getUser(value.key).then(name => userName = name);
                  let newMsg = this.settings.saveChatInDB(value.key, userName, value.payload.val());

                  // "actualiza" los repetidos
                  let index = _.findIndex(MessageServiceProvider.chats, ['key', newMsg.key]);
                  if (index != -1) MessageServiceProvider.chats.splice(index, 1, newMsg);
                  else MessageServiceProvider.chats.push(newMsg);


                  MessageServiceProvider.chats = _.orderBy(
                    MessageServiceProvider.chats,
                    ['lastMessage.timestamp'], ['desc']);

                  this.events.publish('chats');
                }
              }
            });
        }
      }
    });

  }


  preloadChats() {
    // cuando se inicia la app se cargan los chats guardados si existen
    if (!this.chatsPreloaded) {
      console.log('preloading chats...');
      this.settings.getChats()
        .then(chats => MessageServiceProvider.chats = chats)
        .then(() => this.chatsPreloaded = true)
        .then(() => console.log('chats ready'));
    }
  }

  async getChatFrom(userId: string) {
    let userChat = _.find(MessageServiceProvider.chats, ['key', userId]);
    return {
      // @ts-ignore
      'messages': userChat? Object.values(userChat.messages) : [],
      'typing': userChat? userChat.typing : false
    }
  }


  // getFromInternet() {
  //   // tardaba en cargar los chats. mejorar experiencia de usuario
  //   let userChats = this.dbapi.getListOfMyChats();
  //
  //   if (userChats) {
  //     userChats
  //       .subscribe(data => {
  //           data.then(chat => {
  //             // para poner el mensaje nuevo en el top de la lista
  //             let i = _.findIndex(MessageServiceProvider.chats, ['id', chat.id]);
  //             if (i != -1 && chat.lastMsgTimestamp != MessageServiceProvider.chats.lastMsgTimestamp)
  //               MessageServiceProvider.chats.splice(i, 1);
  //             MessageServiceProvider.chats.push(chat);
  //             MessageServiceProvider.chats = _.orderBy(
  //               MessageServiceProvider.chats,
  //               ['lastMsgTimestamp'], ['desc']);
  //             this.events.publish('chatList', MessageServiceProvider.chats);
  //           });
  //         }
  //       )
  //   }
  // }


  // getFromLocalDataBase() {
  //   this.settings.getChats()
  //     .then(value => MessageServiceProvider.chats = value)
  //     .then(() => this.events.publish('chatList', MessageServiceProvider.chats))
  //   ;
  // }
  //
  //
  // getChat(otherUserId: string) {
  //
  //   NetworkProvider.networkStatus.subscribe({
  //     next: available => {
  //       if (available) {
  //         console.log('loading chat from internet');
  //         this.dbapi.getChat(otherUserId);
  //       } else {
  //         console.log('loading chat from local database');
  //         this.getChatFromLocalDataBase(otherUserId);
  //       }
  //     }
  //   });

  // }

  // getChatFromLocalDataBase(otherUserId: string) {
  //   this.settings.getChat(otherUserId)
  //     .then(messages => {
  //       for (let message of messages) {
  //         console.log('message', message);
  //         this.events.publish('chat', message);
  //       }
  //     })
  //   ;
  // }
}
