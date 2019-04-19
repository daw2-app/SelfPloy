import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from 'rxjs';
import * as firebase from "firebase";
import {map} from "rxjs/operators";
import * as _ from 'lodash'
import * as $ from 'jquery'
import {UserSettingsProvider} from "../providers/user-settings/user-settings";
import {Events} from "ionic-angular";
import {NetworkProvider} from "../providers/network/network";


@Injectable()
export class DbApiService{

  constructor(private fdb      : AngularFireDatabase,
              private settings : UserSettingsProvider,
              private events   : Events){
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


  push(child: string, data: {}, key?: string) {
    if (key == null) key = child === "users" ?
      firebase.auth().currentUser.uid :
      firebase.database().ref().child(child).push().key;

    return firebase
      .database()
      .ref()
      .child(child)
      .child(key)
      .set(data);
  }

  getUser(uid: string) {
    return firebase.database()
      .ref('users')
      .child(uid)
      .once('value')
      .then((snapshot) => { return snapshot.val()});
  }

  getOpinionsOfUser(user){
    return firebase.database()
      .ref('opinions')
      .orderByChild('userTo')
      .equalTo(user.id)
      .once('value')
      .then((snapshot) => { return snapshot.val()});
  }

  getCategory(category){
    return firebase.database()
      .ref('users')
      .orderByChild('category')
      .equalTo(category)
      .once('value')
      .then((snapshot) => { return snapshot.val()});
  }

  getChat(otherUserId: string)/*: Observable<any> */{
    let myUserId = firebase.auth().currentUser.uid;

    firebase.database()
      .ref(`/chats/${myUserId}/${otherUserId}/messages`)
      // .limitToLast(20)
      .on('child_added', value => {
        this.settings.saveMessage(otherUserId, value);
        this.events.publish('chat', _.assign(value.val(), {'id': value.key}));
      });

    firebase.database()
      .ref(`chats/${myUserId}/${otherUserId}/typing`)
      .on('value', typing => {
        this.events.publish('chat', typing.val());
      });
  }


  getListOfMyChats(): Observable<any> {
    
    if (firebase.auth().currentUser) {

      let myUserId = firebase.auth().currentUser.uid;

      // return this.fdb.list(`chats/${myUserId}`).snapshotChanges()
      //   .pipe(
      //     map(changes =>
      //       changes.map(async c => {
      //           let mUser: any;
      //           await this.getUser(c.payload.key)
      //             .then((user) => mUser = user)
      //             .then(() => _.assign(mUser, {'id': c.payload.key}));
      //           return ({user: mUser, ...c.payload.val()});
      //         }
      //       )
      //     )
      //   )


      // firebase.database()
      //   .ref(`chats/${myUserId}`)
      //   .on("value", (value: DataSnapshot) => console.log('datasnapshot: ', value));


      let date = new Date();

      return this.fdb.list(`chats/${myUserId}`).stateChanges()
        .pipe(map(async user => {
          let chat: any;
          await this.getUser(user.key)
            .then(userData => chat = userData)
            .then(() => this.getLastChatMessage(user.key)
              .then(lastMsg => _.assign(chat, {
                'id': user.key,
                'lastMsgText': lastMsg.text,
                'lastMsgTimestamp': lastMsg.timestamp,
                'currentTime': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
              })))
            .then(() => this.getTypingStatus(user.key)
              .then(writingStatus => _.assign(chat, {
                'typing': writingStatus
              })))
            .then(() => this.settings.saveChatList(chat))
            .then(() => console.log('conversation: ', chat))
          ;
          // console.log('db: ', chat);
          return chat;
        }));

    } else {
      return null;
    }
  }


  getPreviousMessages(anotherUserId: string, msgId: string) {

    let myUserId = firebase.auth().currentUser.uid;

    return firebase.database()
      .ref(`chats/${myUserId}/${anotherUserId}/messages`)
      .orderByKey()
      .endAt(msgId)
      .limitToLast(6)
      .once('value');

  }


  getLastChatMessage(otherUserId: string) {
    let myUserId = firebase.auth().currentUser.uid;

    return firebase.database()
      .ref(`chats/${myUserId}/${otherUserId}/messages`)
      .limitToLast(1)
      .once('child_added')
      .then((snapshot) => {
        return snapshot.val()
      });
  }


  private getTypingStatus(otherUserId: string) {
    let myUserId = firebase.auth().currentUser.uid;

    return firebase.database()
      .ref(`chats/${myUserId}/${otherUserId}/typing`)
      .once('value')
      .then((snapshot) => {
        return snapshot.val()
      });
  }


  pushMessage(newMessage: { from: any; text: string; timestamp: Object },
              myId         : string,
              anotherUserId: string) {

    console.log('pushing')

    const updates = {};
    const newMessageKey = firebase.database().ref().child("chats").push().key;
    updates[`chats/${myId}/${anotherUserId}/messages/${newMessageKey}`] = newMessage;
    updates[`chats/${anotherUserId}/${myId}/messages/${newMessageKey}`] = newMessage;
    updates[`chats/${anotherUserId}/${myId}/typing`] = false;
    console.log('pushsin', updates)
    return firebase.database().ref().update(updates);
  }


  removeMessages(messages: {}) {
    if (_.size(messages) > 0) firebase.database().ref().update(messages);
  }


  removeChat(id: any) {

    console.log('estamos ' + NetworkProvider.online)

    // si estamos online se eliminan
    if (NetworkProvider.online) {
      console.log(id, NetworkProvider.online);
      let myUserId = firebase.auth().currentUser.uid;
      firebase.database()
        .ref('chats')
        .child(myUserId)
        .child(id)
        .remove()
        .then(() => this.settings.removeChat(id));

      // si no, se marcan para eliminar
    } else {
      this.settings.prepareChatToRemove(id);
    }


  }

  getChats() {
    let myUserId = firebase.auth().currentUser.uid;

    return this.fdb
      .list(`/chats/${myUserId}`)
      .stateChanges();

    // if (subscribe) {
    //   firebase.database()
    //     .ref(`/chats/${myUserId}`)
    //     .on('value', chat => {
    //       console.log('value', chat.val(), 'key', chat.key)
    //       this.settings.saveChatInDB(chat.key, chat.val().messages)
    //     });
    // } else {
      // firebase.database()
      //   .ref(`/chats/${myUserId}`)
      //   .off();  // para evitar crear multiples suscriptores
    // }


  }

}
