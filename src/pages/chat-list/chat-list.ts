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

/**
 * Generated class for the MyChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class MyChatsPage {
  private chats = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private events: Events) {
    this.chats = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyChatsPage');

    this.events.subscribe('chats', chats => {
      if (this.chats.length == 0) this.chats = chats
    });
  }

  messageTapped(user: any) {
    this.navCtrl.push(
      ChatPage,
      user,
      {
        animate: true,
        animation: "transition-ios"
      });
  }


  delete(item: ItemSliding, user: any) {
    this.expandAction(item, 'deleting', 'Chat was deleted.', user);
  }

  expandAction(item: ItemSliding, _: any, text: string, user: any) {
    // TODO item.setElementClass(action, true);


    console.log(user);

    this.alertCtrl.create({
      title: 'R u sure',
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
            console.log('Removing...');
            setTimeout(() => {
              item.close();
              this.dbapi.removeChat(user.id);
              const toast = this.toastCtrl.create({
                message: text
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
