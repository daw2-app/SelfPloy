import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from 'rxjs';
import * as firebase from "firebase";
import {map} from "rxjs/operators";

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

  getChat(otherUserId: string): Observable<any> {
    let myUserId = firebase.auth().currentUser.uid;

    return this.fdb.list(`/chats/${myUserId}/${otherUserId}`).valueChanges();
  }

  getListOfMyChats(): Observable<any> {

    return this.fdb.list("chats").snapshotChanges()
      .pipe(map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
  }

  pushMessage(newMessage: { from: any; text: string; timestamp: Object },
              myId         : string,
              anotherUserId: string) {

    const updates = {};
    const newMessageKey = firebase.database().ref().child("chats").push().key;
    updates[`chats/${myId}/${anotherUserId}/${newMessageKey}`] = newMessage;
    updates[`chats/${anotherUserId}/${myId}/${newMessageKey}`] = newMessage;
    return firebase.database().ref().update(updates);
  }
  getCategory(category){
    return firebase.database()
      .ref('users')
      .orderByChild('category')
      .equalTo(category)
      .once('value')
      .then((snapshot) => { return snapshot.val()});
  }

}
