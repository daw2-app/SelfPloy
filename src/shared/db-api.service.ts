import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from 'rxjs';
import * as firebase from "firebase";
import {getLocaleTimeFormat} from '@angular/common';

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

}
