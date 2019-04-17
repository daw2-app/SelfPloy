import { Component } from '@angular/core';
import {Events, Loading, LoadingController, NavController} from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { DbApiService } from "../../shared/db-api.service";
import {UserDetailPage} from "../user-detail/user-detail";
import {UserSettingsProvider} from "../../providers/user-settings/user-settings";
import {NetworkProvider} from "../../providers/network/network";
import {Subscription} from "rxjs";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private loading          : Loading;
  private internetObserver : Subscription;
  private loadContent       = false;
  private internetAvailable = false;
  private pageLoaded        = false;
  private users             = [];


  constructor(public navCtrl      : NavController,
              public authProvider : AuthProvider,
              public dbapi        : DbApiService,
              public loadingCtrl  : LoadingController) {

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
          console.log('network home: ' + 'nope');
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

      this.showUsers()
        .then(() => this.loading.dismiss());
      this.loadContent = true;
    }
  }


  showUsers() {
    return this.dbapi.getListOf("users")
      .then((snapshot) => {
        for (let k in snapshot) {
          this.users.push({
            id: k,
            name: snapshot[k].name,
            lastName: snapshot[k].lastName,
            category: snapshot[k].category,
            description: snapshot[k].description,
            salary: snapshot[k].salary,
            photo: snapshot[k].photo
          })
        }
      });
  }


  userDetail(user){
    this.navCtrl.push(UserDetailPage,user);
  }

}
