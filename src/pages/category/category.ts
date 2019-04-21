import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { DbApiService } from "../../shared/db-api.service";
import { UserDetailPage}  from "../user-detail/user-detail";
import { NetworkProvider } from "../../providers/network/network";
import { Subscription } from "rxjs";
import {ProfilePage} from "../profile/profile";



@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  private loading          : Loading;
  private internetObserver : Subscription;
  private category         : string;
  private title            : string;
  private loadContent       = false;
  private internetAvailable = false;
  private pageLoaded        = false;
  private users            : any = [];
  private myId             : string;
  private hideError        = true;

  constructor(public navCtrl      : NavController,
              public authProvider : AuthProvider,
              public navParams    : NavParams,
              public dbapi        : DbApiService,
              public loadingCtrl  : LoadingController) {
    this.category = navParams.data.filter;
    this.title    = navParams.data.title;
    this.myId     = authProvider.currentUser ? authProvider.currentUser.uid : "";
  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad HomePage');
    this.internetObserver = NetworkProvider.networkStatus.subscribe({
      next: available => {
        this.internetAvailable = available;

        if (available) {
          if (!this.pageLoaded) {
            this.loadContent = true;
            this.feedContent();
          }
          console.log("user status: ", this.authProvider.isLoggedIn)

        } else {
          if (!this.pageLoaded) this.loadContent = false;
        }

        if (!this.pageLoaded) this.pageLoaded = true;
      }
    });
  }


  ionViewWillLeave() {
    console.log('home says goodbye');
    this.internetObserver.unsubscribe();
  }


  feedContent() {
    if (this.internetAvailable) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.showContent()
        .then(() => {
          this.loading.dismiss()
            .then(() => this.hideError = false);
        });
      this.loadContent = true;
    }
  }


  showContent() {
    return this.dbapi
      .getCategory(this.category)
      .then((snapshot) => {
        for (let k in snapshot) {
          if (k == this.myId) continue;
          this.users.push({
            id          : k,
            name        : snapshot[k].name,
            lastName    : snapshot[k].lastName,
            category    : snapshot[k].category,
            description : snapshot[k].description,
            salary      : snapshot[k].salary,
            photo       : snapshot[k].photo,
            email       : snapshot[k].email
          })
        }
      });
  }


  userDetail(user) {
    this.navCtrl.push(ProfilePage, user);
  }

}
