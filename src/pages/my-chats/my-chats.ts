import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import {ChatPage} from "../chat/chat";

/**
 * Generated class for the MyChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-chats',
  templateUrl: 'my-chats.html',
})
export class MyChatsPage {
  private chats: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyChatsPage');
    this.dbapi.getListOfMyChats()
      .subscribe(data => {
        // cuando se cumplan todas las promesas
        // (porque devuelve un array de promesas) entonces...
        Promise.all(data)
          .then(data => this.chats = data)
          .then(value => console.log("reciv: ", value));
        this.chats = data;
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
}
