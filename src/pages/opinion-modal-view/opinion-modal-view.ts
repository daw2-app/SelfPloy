import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, LoadingController,Loading} from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";

/**
 * Generated class for the OpinionModalViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opinion-modal-view',
  templateUrl: 'opinion-modal-view.html',
})
export class OpinionModalViewPage {
  user_opinions: any = [];
  private user: any;
  private loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController,
              public dbapi: DbApiService,
              public loadingCtrl: LoadingController,) {
    this.user = navParams.data;
    this.loading= this.loadingCtrl.create();
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpinionModalViewPage');
    this.dbapi.getOpinionsOfUser(this.user)
      .then((snapshot) => {
        for (let k in snapshot) {



          this.user_opinions.push({
            id:        k,
            fromName:  snapshot[k].fromName,
            text:      snapshot[k].text,
            timestamp: snapshot[k].timestamp
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

}
