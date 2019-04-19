import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import * as _ from 'lodash';

/*
  Generated class for the UserSettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSettingsProvider {

  constructor(private storage: Storage) {
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

  saveChatList(chat: any) {
    this.storage.set('preview:' + chat.id, chat);
  }

  async getChatList() {
    let chatList = [];
    await this.storage.forEach((value, key, index) => {
      if (key.startsWith('preview:')) {
        chatList.push(value)
      }
    });

    return _.orderBy(
      chatList,
      ['lastMsgTimestamp'], ['desc']);
  }

  async getChat(otherUserId: string) {
    console.log('asdf')
    let chat = [];
    await this.storage.forEach((value: string, key, index) => {
      if (key.startsWith(`message:${otherUserId}`)) {
        let id = key.substring(key.lastIndexOf(':') + 1 );
        chat.push(_.assign(value, {'id': id}))
      }
    });

    return _.orderBy(
      chat,
      ['timestamp'], ['asc']);
  }

  removeChat(id: string) {
    this.storage.forEach((value: string, key, index) => {
      if (key.startsWith(`message:${id}`) || key.startsWith(`preview:${id}`)) this.removeMessage(key)
    });
  }

  removeMessage(id: string, idUser?: string, idMessage?: string) {
    if (id == null) id = 'message:' + idUser + ':' + idMessage;
    this.storage.remove(id);
  }
}
