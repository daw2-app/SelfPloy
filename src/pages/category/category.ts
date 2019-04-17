import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import {UserDetailPage} from "../user-detail/user-detail";
import {NetworkProvider} from "../../providers/network/network";
import {Subscription} from "rxjs";

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  user_filter              = [];
  private category         : string;
  private loading          : Loading;
  private internetObserver : Subscription;
  private loadContent       = false;
  private internetAvailable = false;
  private pageLoaded        = false;

  constructor(public navCtrl      : NavController,
              public navParams    : NavParams,
              public db           : DbApiService,
              public loadingCtrl  : LoadingController) {
    this.category= navParams.data
  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad CategoryPage');
    this.internetObserver = NetworkProvider.networkStatus.subscribe({
      next: available => {
        this.internetAvailable = available;

        if (available) {
          if (!this.pageLoaded) {
            this.loadContent = true;
            this.feedContent();
          }

        } else {
          if (!this.pageLoaded) this.loadContent = false;
        }

        if (!this.pageLoaded) this.pageLoaded = true;
      }
    });


  }


  userDetail(user){
    this.navCtrl.push(UserDetailPage,user);
  }


  feedContent() {
    if (this.internetAvailable) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.showContent()
        .then(() => this.loading.dismiss());
      this.loadContent = true;
    }
  }


  showContent() {
    return this.db.getCategory(this.category)
      .then((snapshot) => {
        for (let k in snapshot) {
          this.user_filter.push({
            id: k,
            name:        snapshot[k].name,
            lastName:    snapshot[k].lastName,
            category:    snapshot[k].category,
            description: snapshot[k].description,
            salary:      snapshot[k].salary,
            photo:       snapshot[k].photo
          })
        }
      });
  }
}
