import {Injectable} from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  private _isLoggedIn: boolean;
  private _currentUser: any = {};

  constructor() {
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
    this._currentUser = value;
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
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
      ;
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }


}
