import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikeModalPage } from './like-modal';

@NgModule({
  declarations: [
    LikeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LikeModalPage),
  ],
})
export class LikeModalPageModule {}
