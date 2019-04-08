import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";

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
        this.chats = data;
        console.log(data)
      });
  }

  messageTapped(chat: any) {
    console.log(chat);
  }
}
