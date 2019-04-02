import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MCloudinaryPage } from './m-cloudinary';

@NgModule({
  declarations: [
    MCloudinaryPage,
  ],
  imports: [
    IonicPageModule.forChild(MCloudinaryPage),
  ],
})
export class MCloudinaryPageModule {}
