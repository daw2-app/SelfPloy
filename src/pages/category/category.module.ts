import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryPage } from './category';
import {CloudinaryModule} from "@cloudinary/angular-5.x";

@NgModule({
  declarations: [
    CategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryPage),
    CloudinaryModule,
  ],
})
export class CategoryPageModule {}
