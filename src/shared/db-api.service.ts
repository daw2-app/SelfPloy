import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from 'rxjs';
import * as firebase from "firebase";
import {map} from "rxjs/operators";
import * as _ from 'lodash'
import * as $ from 'jquery'
import {UserSettingsProvider} from "../providers/user-settings/user-settings";
import {Events} from "ionic-angular";


@Injectable()
export class DbApiService{

  constructor(private fdb: AngularFireDatabase,
              private settings: UserSettingsProvider,
              private events: Events){
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
            .then(async () => {
              this.getCountNotReadedMessages(user.key)
                .then(cosos => _.assign(chat, {
                  'notReaded' : cosos
                }))
            })
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


  pushMessage(newMessage: {
                timestamp : Object,
                from      : string,
                readed    : boolean,
                text      : string },
              myId          : string,
              anotherUserId : string) {

    const updates = {};
    const newMessageKey = firebase.database().ref().child("chats").push().key;
    updates[`chats/${myId}/${anotherUserId}/messages/${newMessageKey}`] = newMessage;
    updates[`chats/${anotherUserId}/${myId}/messages/${newMessageKey}`] = newMessage;
    return firebase.database().ref().update(updates);
  }


  removeChat(id: any) {
    console.log(id);
    let myUserId = firebase.auth().currentUser.uid;
    firebase.database()
      .ref('chats')
      .child(myUserId)
      .child(id)
      .remove();
    this.settings.removeChat(id);
  }


  markAsRead(anotherUserId: string, msgId: string) {

    let myUserId = firebase.auth().currentUser.uid;

    firebase.database()
      .ref()
      .child('chats')
      .child(myUserId)
      .child(anotherUserId)
      .child('messages')
      .child(msgId)
      .child('readed')
      .set(true);
  }

  private getCountNotReadedMessages(anotherUserId: string) {
    let myUserId = firebase.auth().currentUser.uid;

    return firebase
      .database()
      .ref()
      .child('chats')
      .child(myUserId)
      .child(anotherUserId)
      .child('messages')
      .orderByChild('readed')
      .equalTo(false)
      .once('value')
      .then(count => {return _.size(count.val())})
  }
}
