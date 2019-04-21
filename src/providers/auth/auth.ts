import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {DbApiService} from "../../shared/db-api.service";
import {UserSettingsProvider} from "../user-settings/user-settings";
import {BehaviorSubject} from "rxjs";
import {MessageServiceProvider} from "../message-service/message-service";

@Injectable()
export class AuthProvider {

  static userStatus    = new BehaviorSubject(false);
  private _isLoggedIn  : boolean;
  private _currentUser : any = {};
  private homeTabId = 'tab-t0-1';
  private profileTabId = 'tab-t0-3';

  constructor(
    private dbapi            : DbApiService,
    private userSettings     : UserSettingsProvider,
    private messagesProvider : MessageServiceProvider) {
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get currentUser(): any {
    return this._currentUser;
  }

  set isLoggedIn(value: boolean) {
    AuthProvider.userStatus.next(value);
    this._isLoggedIn = value;
  }

  set currentUser(value: any) {
    this.isLoggedIn = value != null;
    this._currentUser = value;
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => this.dbapi.getCurrentUser()
        .then(value => {
          this.userSettings.login(value);
          this.currentUser = value;
          this.messagesProvider.startChatListObserver();
        }))
      .then(() => document.getElementById(this.profileTabId).click());
  }

  signupUser(email: string, password: string, name: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        let uid = response.user.uid;
        firebase
          .database()
          .ref()
          .child("users")
          .child(uid)
          .set({
            admin: false,
            name: name,
            email: email,
          })
      })
      .then(() => this.dbapi.getCurrentUser()
        .then(value => this.userSettings.login(value)))
      .then(() => document.getElementById(this.profileTabId).click());

  }

  logoutUser(): Promise<void> {
    this.currentUser = null;
    this.userSettings.logout();
    this.messagesProvider.unsuscribeChatList();

    return firebase
      .auth()
      .signOut()
      .then(() => document.getElementById(this.homeTabId).click());
  }

  updateUser(user: any) {
    this.userSettings.login(user);
    this.currentUser = user;
  }
}
