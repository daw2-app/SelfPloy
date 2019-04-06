import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {
  private isLoggedIn = false;

  constructor() {
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
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
            name: "",
            email: email
          })
      })
      ;
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }


}
