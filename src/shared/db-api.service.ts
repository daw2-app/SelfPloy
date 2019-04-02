import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from 'rxjs';
import * as firebase from "firebase";

@Injectable()
export class DbApiService{
  currentUserData : any;


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
  pushUserData(name,lastName,email,category,description,salary,admin){
    firebase
      .database()
      .ref()
      .child("users")
      .child(firebase.auth().currentUser.uid)
      .set({
        lastName: lastName,
        name: name,
        email: email,
        category: category,
        description: description,
        salary: salary,
        admin : admin
      })
  }
}
