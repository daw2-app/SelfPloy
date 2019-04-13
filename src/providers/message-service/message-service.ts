import {Injectable} from '@angular/core';
import {DbApiService} from "../../shared/db-api.service";
import {Events} from "ionic-angular";
import * as _ from "lodash"

/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageServiceProvider {

  static chats: any = [];

  constructor(public dbapi: DbApiService,
              private events: Events) {
    console.log('Hello MessageServiceProvider Provider');
  }

  startChatListObserver() {
    // tardaba en cargar los chats. mejorar experiencia de usuario
    let userChats = this.dbapi.getListOfMyChats();

    if (userChats) {
      userChats
        .subscribe(data => {
            data.then(chat => {
              let i = _.findIndex(MessageServiceProvider.chats, ['id', chat.id]);
              if (i != -1) MessageServiceProvider.chats.splice(i, 1);
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
}
