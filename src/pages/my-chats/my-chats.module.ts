import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyChatsPage } from './my-chats';

@NgModule({
  declarations: [
    MyChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyChatsPage),
  ],
})
export class MyChatsPageModule {}
