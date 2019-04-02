import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
import { environment } from '../environments/environment';



import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { SplashPage } from "../pages/splash/splash";
import { AuthProvider } from '../providers/auth/auth';
import { ContactListPage } from "../pages/contact-list/contact-list";
import { DbApiService } from "../shared/db-api.service";
import { AngularFireDatabase } from "@angular/fire/database";
import {ProfilePage} from "../pages/profile/profile";
import {ProfileEditPage} from "../pages/profile-edit/profile-edit";
import {UserDetailPage} from "../pages/user-detail/user-detail";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SplashPage,
    LoginPage,
    RegisterPage,
    ContactListPage,
    ProfilePage,
    ProfileEditPage,
    UserDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SplashPage,
    LoginPage,
    RegisterPage,
    ContactListPage,
    ProfilePage,
    ProfileEditPage,
    UserDetailPage
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
export class AppModule {}
