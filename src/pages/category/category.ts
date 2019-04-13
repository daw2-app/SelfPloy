import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DbApiService} from "../../shared/db-api.service";
import {UserDetailPage} from "../user-detail/user-detail";

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  user_filter : any = [];
  category : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DbApiService) {
    this.category= navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
      return this.db.getCategory(this.category)
        .then((snapshot) => {
          for (let k in snapshot) {
            this.user_filter.push({
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
