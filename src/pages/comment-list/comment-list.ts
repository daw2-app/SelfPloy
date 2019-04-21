import { Component } from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import {CommentNewPage} from "../comment-new/comment-new";
import {AuthProvider} from "../../providers/auth/auth";
import * as _ from 'lodash'

@Component({
  selector: 'page-comment-list',
  templateUrl: 'comment-list.html',
})
export class CommentListPage {
  user_opinions        : any = [];
  private user         : any;
  private loading      : Loading;
  private userLoggedIn : boolean;
  private iAm          : boolean;
  private userId       : any;

  constructor(public navCtrl       : NavController,
              public navParams     : NavParams,
              public dbapi         : DbApiService,
              public modalCtrl     : ModalController,
              public loadingCtrl   : LoadingController,
              private authProvider : AuthProvider) {
    this.user    = navParams.data;
    this.iAm = _.size(this.user) == 0;
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpinionModalViewPage');

  }

  ionViewWillEnter() {
    this.iAm = this.user.id == null;
    this.userId = this.iAm ? this.authProvider.currentUser.uid : this.user.id;
    this.userLoggedIn = this.authProvider.isLoggedIn;

    this.dbapi.getOpinionsOfUser(this.userId)
      .then((snapshot) => {
        this.user_opinions = [];
        for (let k in snapshot) {

          this.user_opinions.push({
            id        : k,
            fromName  : snapshot[k].fromName,
            text      : snapshot[k].text,
            timestamp : snapshot[k].timestamp
          });
          console.log("timestamp: ", new Date((snapshot[k].timestamp)));
        }
      })
      .then(() => this.loading.dismiss());
    console.log(this.user_opinions);
  }


  closeModal(){
    this.navCtrl.pop();
  }

  newComment() {
      this.modalCtrl
        .create(CommentNewPage, this.user)
        .present();
  }
}
