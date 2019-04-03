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
      userFrom: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LikeModal Page');
    let loading = this.loadingCtrl.create({
      content: "Buenas estamos cargando tu puta mierda de valoracion"
    });
    loading.present();
    this.dbapi.getCurrentUser()
      .then(value => this.currentUser= value)
      .then(() => loading.dismiss())
  }
  saveAssessment(){
    /*console.log(this.user,this.currentUser.name);*/

    this.dbapi.pushAssessment(this.userForm.value.text,
      this.userForm.value.userFrom,
      this.user.id,
      this.currentUser);
  }
  backToProfile() {
    this.navCtrl.pop();

  }
}
