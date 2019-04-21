import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DbApiService} from "../../shared/db-api.service";
import {AuthProvider} from "../../providers/auth/auth";
import * as firebase from "firebase";

@Component({
  selector: 'page-comment-new',
  templateUrl: 'comment-new.html',
})
export class CommentNewPage {
  userForm: FormGroup;
  private user: any;
  private currentUser: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
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
      text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      userTo: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LikeModal Page');
    this.currentUser = this.authProvider.currentUser;
  }

  saveOpinion() {
    this.dbapi.push(
      "opinions",
      {
        text: this.userForm.value.text,
        fromName: this.currentUser.name,
        userFrom: firebase.auth().currentUser.uid,
        userTo: this.user.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .then(() => this.backToProfile());
  }

  backToProfile() {
    this.navCtrl.pop();
  }
}
