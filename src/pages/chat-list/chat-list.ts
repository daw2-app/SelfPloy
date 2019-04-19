import { Component } from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  ItemSliding,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import {ChatPage} from "../chat/chat";
import {UserDetailPage} from "../user-detail/user-detail";
import * as _ from 'lodash'
import {MessageServiceProvider} from "../../providers/message-service/message-service";
import {Subscription} from "rxjs";

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  private internetObserver : Subscription;
  static chatList          = [];
  private chats            = [];

  constructor(private navCtrl   : NavController,
              private navParams : NavParams,
              private dbapi     : DbApiService,
              private toastCtrl : ToastController,
              private alertCtrl : AlertController,
              private events    : Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');

    // lista precreeada
    this.chats = MessageServiceProvider.chats;

    this.events.subscribe('chats', () =>
      this.chats = MessageServiceProvider.chats
    );

  }

  ionViewWillLeave() {
    console.log('chat-list says goodbye');
  }


  chatTapped(chat: any) {
    this.navCtrl.push(
      ChatPage,
      {
        'user' : chat.user,
        'id'   : chat.key
      },
      {
        animate: true,
        animation: "transition-ios"
      });
  }


  delete(item: ItemSliding, user: any) {
    this.expandAction(item, user);
  }


  expandAction(item: ItemSliding, user: any) {
    // TODO item.setElementClass(action, true);

    console.log('deleting...',user);

    this.alertCtrl.create({
      title: 'R u sure?',
      message: 'Say u last goodbye',
      buttons: [
        {
          text: 'no! w8',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            item.close();
          }
        },
        {
          text: 'im ready',
          handler: () => {
            console.log('deleting...');
            setTimeout(() => {
              item.close();
              var index = _.findIndex(this.chats, ['key', user.id]);
              this.dbapi.removeChat(user.key);
              this.chats.splice(index, 1);
              const toast = this.toastCtrl.create({
                message: 'Chat was deleted.'
              });
              toast.present();
              // TODO item.setElementClass(action, false);

              setTimeout(() => toast.dismiss(), 2000);
            }, 500);
          }
        }
      ]
    }).present();
  }


  goToProfile(event: Event, user: any) {
    event.stopPropagation();
    this.navCtrl.push(
      UserDetailPage,
      user);
  }
}
