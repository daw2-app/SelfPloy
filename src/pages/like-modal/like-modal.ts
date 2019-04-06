import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DbApiService} from "../../shared/db-api.service";
import * as firebase from "../../shared/db-api.service";

/**
 * Generated class for the LikeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-like-modal',
  templateUrl: 'like-modal.html',
})
export class LikeModalPage {
  userForm: FormGroup;
  private user: any;
  private currentUser:any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public dbapi: DbApiService,
              public loadingCtrl: LoadingController
  ) {

    this.user = navParams.data;
    this.userForm = this.createMyForm();

  }
  private createMyForm() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      userTo: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LikeModal Page');
    let loading = this.loadingCtrl.create({
      content: "Haciendo cosas"
    });
    loading.present();
    this.dbapi.getCurrentUser()
      .then(value => this.currentUser= value)
      .then(() => loading.dismiss())
  }
  saveOpinion(){
    /*console.log(this.user,this.currentUser.name);*/

    this.dbapi.pushOpinion(this.userForm.value.text,
      this.user.id,
      this.currentUser.name);
  }
  backToProfile() {
    this.navCtrl.pop();

  }
}
