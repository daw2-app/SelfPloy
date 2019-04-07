import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DbApiService} from "../../shared/db-api.service";
import * as firebase from "firebase";
import {AuthProvider} from "../../providers/auth/auth";

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
              public loadingCtrl: LoadingController,
              public authProvider: AuthProvider
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
    this.dbapi.push(
      "opinions",
      {
        text:     this.userForm.value.text,
        fromName: this.currentUser.name,
        userFrom: firebase.auth().currentUser.uid,
        userTo:   this.user.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .then(() => this.backToProfile());
  }

  backToProfile() {
    this.navCtrl.pop();
  }
}
