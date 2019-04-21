import { Component } from '@angular/core';
import { Events, LoadingController, NavController, ToastController } from 'ionic-angular';
import * as _ from 'lodash'
import {CategoriesProvider} from "../../providers/categories/categories";
import {CategoryPage} from "../category/category";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private categories = _.chunk(this.categoryProvider.getCategories(), 2);
  private usersByCategory = [];

  constructor(public navCtrl           : NavController,
              private categoryProvider : CategoriesProvider) {
  }


  ionViewDidLoad() {
    // this.events.subscribe('chatList');
    console.log('hellouda main', this.categories)
  }

  ionViewWillEnter() {
    this.usersByCategory = this.categoryProvider.getCategories();
  }

  goTo(category: any) {
    this.navCtrl.push(
      CategoryPage,
      category,
      {
        animate: true,
        direction: 'forward'
      });
  }
}
