import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import * as _ from 'lodash';
import {auth} from "firebase";
import {k} from "@angular/core/src/render3";
/*
  Generated class for the UserSettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSettingsProvider {

  static chats = [];

  constructor(private storage : Storage) {
    console.log('Hello UserSettingsProvider Provider');
  }


  login(user: any) {
    this.storage.set('user', user);
  }

  logout() {
    return this.storage.remove('user')
      .then(value => console.log('stg: ', value))
      .catch(value => console.error('stg: ', value));
  }

  async getCurrentUser() {
    return this.storage.get('user');
  }

  saveMessage(otherUserId: string, msg: any) {
    if (typeof msg.val() !== "boolean") {

      let key = 'message:' + otherUserId + ':' + msg.key;

      this.storage.get(key)
        .then(data => {
          if (!data) this.storage.set(key, msg.val());
        });
    }
  }

  saveChatInDB(otherUserId: string, userName: string, chat: any) {

      let key = 'chat:' + otherUserId;
      let date = new Date();

      let chatInfo = {
        'key':          key.substring(5),
        'typing' :      chat.typing,
        'user':         userName,
        'messages':     chat.messages,
        'currentTime':  date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
        'lastMessage':  chat.messages[Object.keys(chat.messages)[Object.keys(chat.messages).length - 1]]
      };

      this.storage.set(key, chatInfo);

      return chatInfo;
  }

  async getChats() {
    let chatList = [];
    await this.storage.forEach((value, key, index) => {
      if (key.startsWith('chat:')) {
        chatList.push(value)
      }
    });

    console.log('chatlist:', chatList);
    return _.orderBy(
      chatList,
      ['lastMessage.timestamp'], ['desc']);

  }


  saveChatList(chat: any) {
    this.storage.set('preview:' + chat.id, chat);
  }

  //
  // async getChat(otherUserId: string) {
  //   console.log('asdf')
  //   let chat = [];
  //   await this.storage.forEach((value: string, key, index) => {
  //     if (key.startsWith(`message:${otherUserId}`)) {
  //       let id = key.substring(key.lastIndexOf(':') + 1 );
  //       chat.push(_.assign(value, {'id': id}))
  //     }
  //   });
  //
  //   return _.orderBy(
  //     chat,
  //     ['timestamp'], ['asc']);
  // }

  removeChat(id: string) {
    this.storage.remove(`chat:${id}`);
  }

  prepareChatToRemove(id: any) {
    this.storage.get(`chat:${id}`)
      .then(value => this.storage.set(`remove:${id}`, value))
      .then(() => this.storage.remove(`chat:${id}`))
  }

  async checkDeletePendingMessages() {

    let user = auth().currentUser;

    if (user) {
      let chatsToRemove = {};
      console.log('checking pending chats to be removed...');
      await this.storage.forEach(async (value, key, index) => {
        console.log('look ' + key)
        if (key.startsWith('remove:')) {

          let messages = Object.keys(value.messages);
          let path = `/chats/${user.uid}/${value.key}/messages/`;

          for (let i = 0; i < messages.length; ++i) chatsToRemove[path + messages[i]] = null;

          console.log('deleeeeete',  this.storage.remove(key))
          await this.storage.remove(key);
        }
      });
      console.log('check pending messages done' + chatsToRemove);
      return chatsToRemove;
      }
    return null;
  }

}
