import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ChatListPage } from "../chat-list/chat-list";
import { LoginPage } from "../login/login";
import { ProfilePage } from "../profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
import {NetworkProvider} from "../../providers/network/network";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChatListPage;
  tab2Root = HomePage;
  tab3Root = LoginPage;
  tab4Root = ProfilePage;

  userLogged        : boolean;
  internetAvailable : boolean;

  constructor() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    AuthProvider.userStatus.subscribe({next: status => {
      this.userLogged = status;
      }})

    NetworkProvider.networkStatus.subscribe({next: available => {
        this.internetAvailable = available;
      }})
  }
}
