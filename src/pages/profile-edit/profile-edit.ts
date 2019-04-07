import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbApiService } from "../../shared/db-api.service";
import { AuthProvider } from "../../providers/auth/auth";
import {ProfilePage} from "../profile/profile";


/**
 * Generated class for the ProfileEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {
  userForm: FormGroup;
  private user:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public authProvider: AuthProvider,
              public dbapi: DbApiService
  ) {
    this.user = navParams.data;
    this.userForm = this.createMyForm();


  }
  private createMyForm(){
    return this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', Validators.required],
      passwordRetry: this.formBuilder.group({
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required]
      })
    });
  }

  async saveUserData(){
    await this.dbapi.pushUserData(this.userForm.value.name,
      this.userForm.value.lastName,
      this.userForm.value.email,
      this.userForm.value.category,
      this.userForm.value.description,
      this.userForm.value.salary,
      this.user.admin
    );
    this.dbapi.getCurrentUser()
      .then(val => this.authProvider.currentUser = val);
  }

  backToProfile() {
    this.navCtrl.pop();

  }

}
