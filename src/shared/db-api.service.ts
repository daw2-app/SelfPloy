import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from 'rxjs';
import * as firebase from "firebase";

@Injectable()
export class DbApiService{

  constructor(private fdb: AngularFireDatabase){
  }

  getListOf(child: string) {
    return firebase.database()
      .ref(`/${child}`)
      .once('value')
      .then((snapshot) => { return snapshot.val() });
  }


  getCurrentUser(){
    let userId = firebase.auth().currentUser.uid;

    return firebase.database()
      .ref(`/users/${userId}`)
      .once('value')
      .then((snapshot) => { return snapshot.val() });
  }


  push(child: string, data: {}) {
    const key = child === "users" ?
      firebase.auth().currentUser.uid :
      firebase.database().ref().child(child).push().key;

    return firebase
      .database()
      .ref()
      .child(child)
      .child(key)
      .set(data);
  }

  getOpinionsOfUser(user){
    return firebase.database()
      .ref('opinions')
      .orderByChild('userTo')
      .equalTo(user.id)
      .once('value')
      .then((snapshot) => { return snapshot.val()});
  }
}
