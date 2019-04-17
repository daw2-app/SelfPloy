import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatListPage } from './chat-list';
import {CloudinaryModule} from "@cloudinary/angular-5.x";

@NgModule({
  declarations: [
    ChatListPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatListPage),
    CloudinaryModule,
  ],
})
export class ChatListPageModule {}
