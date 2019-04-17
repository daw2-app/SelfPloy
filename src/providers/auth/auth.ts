import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {DbApiService} from "../../shared/db-api.service";
import {UserSettingsProvider} from "../user-settings/user-settings";

@Injectable()
export class AuthProvider {

  private _isLoggedIn: boolean;
  private _currentUser: any = {};

  constructor(
    private dbapi: DbApiService,
    private userSettings: UserSettingsProvider,) {
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get currentUser(): any {
    return this._currentUser;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  set currentUser(value: any) {
    this.isLoggedIn = value != null;
    this._currentUser = value;
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => this.dbapi.getCurrentUser()
        .then(value => this.userSettings.login(value)));
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
        .then(value => this.userSettings.login(value)));
  }

  logoutUser(): Promise<void> {
    this.currentUser = null;
    this.userSettings.logout();
    return firebase.auth().signOut();
  }
}
