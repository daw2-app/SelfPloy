import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpinionModalViewPage } from './opinion-modal-view';

@NgModule({
  declarations: [
    OpinionModalViewPage,
  ],
  imports: [
    IonicPageModule.forChild(OpinionModalViewPage),
  ],
})
export class OpinionModalViewPageModule {}
