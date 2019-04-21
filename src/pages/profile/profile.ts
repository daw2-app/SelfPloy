import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserSettingsProvider } from "../../providers/user-settings/user-settings";
import { ProfileEditPage } from "../profile-edit/profile-edit";
import * as _ from 'lodash'
import {AuthProvider} from "../../providers/auth/auth";
import {ChatPage} from "../chat/chat";
import {CommentListPage} from "../comment-list/comment-list";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private user: any;
  private iAm : boolean;

  constructor(public navCtrl       : NavController,
              public navParams     : NavParams,
              public setting       : UserSettingsProvider,
              private authProvider : AuthProvider) {
    this.user = navParams.data;
    this.iAm = _.size(this.user) == 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


  ionViewWillEnter() {
    if (this.iAm) this.user = this.authProvider.currentUser;
    console.log(this.user);


    console.log('ionViewDidLoad ProfilePage');
  }

  modifyProfile() {
    this.navCtrl.push(ProfileEditPage, this.user);
  }

  openChat() {
    if (ChatPage.name == this.navCtrl.getPrevious().name) this.navCtrl.pop();
    else this.navCtrl.push(ChatPage, this.user);
  }

  showAllOpinions(user: any) {
    this.navCtrl.push(CommentListPage, user)
  }
}
