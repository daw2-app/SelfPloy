import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import * as firebase from "firebase";


@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  private user:any;
  private currentUser:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService) {
    this.user = navParams.data;
    this.dbapi.getCurrentUser()
      .then((value) => this.currentUser = value);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailPage');
  }
  addAsset(user){
    

  }
}
