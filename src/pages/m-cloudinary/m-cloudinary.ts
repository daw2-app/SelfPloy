import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import { CloudinaryOptions, CloudinaryUploader} from 'ng2-cloudinary';
import {environment} from "../../environments/environment";

/**
 * Generated class for the MCloudinaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-m-cloudinary',
  templateUrl: 'm-cloudinary.html',
})
export class MCloudinaryPage {

  private loading: Loading;
  public_id: string;


  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({
      cloudName: environment.cloudinary.cloud_name,
      uploadPreset: environment.cloudinary.upload_preset
    })
  );


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MCloudinaryPage');
  }

  onFileSelected(event: Event) {
    console.log(event);
  }

  onUpload() {

    console.log("uploading");
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      console.log(res);
      this.public_id = res.public_id;
    };
    this.uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    this.loading.dismiss();
  }
}
