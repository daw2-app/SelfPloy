import { Component } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { DbApiService } from "../../shared/db-api.service";
import {UserDetailPage} from "../user-detail/user-detail";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: Loading;
  users: any = [];


  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              public dbapi: DbApiService,
              public loadingCtrl: LoadingController,
              ) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.showUsers()
      .then(() => this.loading.dismiss());

    console.log("user status: ", this.authProvider.isLoggedIn)
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
