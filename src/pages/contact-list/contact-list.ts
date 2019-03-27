import { Component } from '@angular/core';
import { IonicPage, ItemSliding, Loading, LoadingController, NavController, NavParams, Refresher, ToastController } from 'ionic-angular';
import { DbApiService } from "../../shared/db-api.service";
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the ContactListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  private loading: Loading;
  users: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public dbapi: DbApiService,
              private toastCtrl: ToastController,
              public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.feedUsers()
      .then(() => this.loading.dismiss());
  }

   feedUsers() {
     return this.dbapi.getListOf("users")
       .then((snapshot) => {
         for (let k in snapshot) {
           this.users.push({
             id: k,
             name: snapshot[k].name,
             email: snapshot[k].email
           })
         }
       });
  }

  more(item: ItemSliding) {
    console.log('More');
    item.close();
  }

  delete(item: ItemSliding) {
    console.log('Delete');
    item.close();
  }

  mute(item: ItemSliding) {
    console.log('Mute');
    item.close();
  }

  archive(item: ItemSliding) {
    this.expandAction(item, 'archiving', 'Chat was archived.');
  }

  expandAction(item: ItemSliding, _: any, text: string) {
    // TODO item.setElementClass(action, true);

    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: text
      });
      toast.present();
      // TODO item.setElementClass(action, false);
      item.close();

      setTimeout(() => toast.dismiss(), 2000);
    },  500);
  }

  doRefresh(refresher: Refresher) {
    this.feedUsers()
      .then(() => refresher.complete());
  }

  signOut() {
    this.authProvider.logoutUser()
      .then(() => this.navCtrl.setRoot(
        LoginPage,
        {},
        {
          animate: true,
          direction: 'back'
        }));
  }
}
