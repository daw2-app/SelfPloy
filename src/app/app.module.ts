import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {AngularFireModule} from 'angularfire2'
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth'
import {environment} from '../environments/environment';


import {MyApp} from './app.component';
import {MainPage} from '../pages/main/main';
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {SplashPage} from "../pages/splash/splash";
import {AuthProvider} from '../providers/auth/auth';
import {ContactListPage} from "../pages/contact-list/contact-list";
import {DbApiService} from "../shared/db-api.service";
import {AngularFireDatabase} from "@angular/fire/database";
import {HomePage} from '../pages/home/home';
import {ProfilePage} from "../pages/profile/profile";
import {ProfileEditPage} from "../pages/profile-edit/profile-edit";
import {UserDetailPage} from "../pages/user-detail/user-detail";
import {LikeModalPage} from "../pages/like-modal/like-modal";
import {OpinionModalViewPage} from "../pages/opinion-modal-view/opinion-modal-view";

import {MCloudinaryPage} from "../pages/m-cloudinary/m-cloudinary";

import {HttpClientModule} from "@angular/common/http";
import {FileUploadModule} from 'ng2-file-upload';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MyChatsPage} from "../pages/chat-list/chat-list";
import {ChatPage} from "../pages/chat/chat";
import {IonicStorageModule} from "@ionic/storage";
import {CategoryPage} from "../pages/category/category";

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    SplashPage,
    LoginPage,
    RegisterPage,
    ContactListPage,
    ProfilePage,
    ProfileEditPage,
    MCloudinaryPage,
    HomePage,
    UserDetailPage,
    LikeModalPage,
    OpinionModalViewPage,
    MyChatsPage,
    ChatPage,
    CategoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    HttpClientModule,
    FileUploadModule,
    FontAwesomeModule,
    IonicStorageModule.forRoot(),
    [
      CloudinaryModule.forRoot({Cloudinary}, { cloud_name: environment.cloudinary.cloud_name } as CloudinaryConfiguration),
    ],
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPage,
    SplashPage,
    LoginPage,
    RegisterPage,
    ContactListPage,
    ProfilePage,
    ProfileEditPage,
    MCloudinaryPage,
    HomePage,
    UserDetailPage,
    LikeModalPage,
    OpinionModalViewPage,
    MyChatsPage,
    ChatPage,
    CategoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    DbApiService,
    AngularFireDatabase,
    AuthProvider
  ]
})
export class AppModule {
}
