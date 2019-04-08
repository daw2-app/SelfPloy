import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbApiService } from "../../shared/db-api.service";
import { AuthProvider } from "../../providers/auth/auth";


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

  saveUserData(){


    this.dbapi.push(
      "users",
      {
        lastName:    this.userForm.value.lastName,
        name:        this.userForm.value.name,
        email:       this.userForm.value.email,
        category:    this.userForm.value.category,
        description: this.userForm.value.description,
        salary:      this.userForm.value.salary,
        admin:       this.user.admin
      })
      .then(() => this.dbapi.getCurrentUser())
      .then(val => {
        this.authProvider.currentUser = val;
        console.log("nuevo valor: ", val);
      })
      .then(() => this.backToProfile());
  }

  backToProfile() {
    this.navCtrl.pop();
  }

}
