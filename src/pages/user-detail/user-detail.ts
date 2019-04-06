import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import {LikeModalPage} from "../like-modal/like-modal";
import {OpinionModalViewPage} from "../opinion-modal-view/opinion-modal-view";


@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  private user:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbapi: DbApiService,
              public modalCtrl: ModalController) {
    this.user = navParams.data;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailPage');
  }

  abrirModal(){
    let modal = this.modalCtrl.create(LikeModalPage,this.user);
    modal.present();
  }
  showAllOpinions(){
    let modal = this.modalCtrl.create(OpinionModalViewPage,this.user);
    modal.present();
  }
}
