import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChatListPage } from "../pages/chat-list/chat-list";
import { LoginPage } from "../pages/login/login";
import { ProfilePage } from "../pages/profile/profile";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RegisterPage } from "../pages/register/register";
import { AuthProvider } from "../providers/auth/auth";
import { DbApiService } from "../shared/db-api.service";
import { AngularFireDatabase } from "@angular/fire/database";


import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
import { environment } from '../environments/environment';


// import {MainPage} from '../pages/main/main';
// import {SplashPage} from "../pages/splash/splash";
// import {ProfileEditPage} from "../pages/profile-edit/profile-edit";
// import {UserDetailPage} from "../pages/user-detail/user-detail";
// import {LikeModalPage} from "../pages/like-modal/like-modal";
// import {OpinionModalViewPage} from "../pages/opinion-modal-view/opinion-modal-view";
//
// import {MCloudinaryPage} from "../pages/m-cloudinary/m-cloudinary";

import { HttpClientModule } from "@angular/common/http";
import { FileUploadModule } from 'ng2-file-upload';

// import {ChatPage} from "../pages/chat/chat";
import { IonicStorageModule } from "@ionic/storage";

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { MessageServiceProvider } from '../providers/message-service/message-service';
import { NetworkProvider } from '../providers/network/network';
import { Network } from "@ionic-native/network";
import { UserSettingsProvider } from '../providers/user-settings/user-settings';
import { ChatPage } from "../pages/chat/chat";
import { CategoryPage } from "../pages/category/category";
import { CategoriesProvider } from '../providers/categories/categories';
import { ProfileEditPage } from "../pages/profile-edit/profile-edit";
import {CommentListPage} from "../pages/comment-list/comment-list";
import {CommentNewPage} from "../pages/comment-new/comment-new";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ChatListPage,
    RegisterPage,
    LoginPage,
    ProfilePage,
    ChatPage,
    CategoryPage,
    ProfileEditPage,
    CommentListPage,
    CommentNewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    HttpClientModule,
    FileUploadModule,
    CloudinaryModule,
    FontAwesomeModule,
    IonicStorageModule.forRoot(),
    [
      CloudinaryModule.forRoot({Cloudinary}, { cloud_name: environment.cloudinary.cloud_name } as CloudinaryConfiguration),
    ]
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    ChatListPage,
    RegisterPage,
    LoginPage,
    ProfilePage,
    ChatPage,
    CategoryPage,
    ProfileEditPage,
    CommentListPage,
    CommentNewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DbApiService,
    AngularFireDatabase,
    AngularFireAuth,
    AuthProvider,
    MessageServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},,
    UserSettingsProvider,
    Network,
    NetworkProvider,
    CategoriesProvider
  ]
})
export class AppModule {}
