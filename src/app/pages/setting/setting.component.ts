import { Component, OnInit, TemplateRef } from '@angular/core';
import { icons } from 'eva-icons';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from './dialog-prompt/dialog-prompt.component';
import { ImageCroppedEvent } from './image-cropper/interfaces/image-cropped-event.interface';
import { ToastrService } from "../../services/toastr.service";
import { HttpService } from "../../services/http.service";
import { ShareDataService } from "../../services/share-data.service";

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  userData: any = { 'username': '', 'link': '', 'user_id': '', 'country': '' };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageSize: any = '';
  userImage: any;
  userImageBase64: any;
  constructor(
    private toastrService: ToastrService,
    private dialogService: NbDialogService,
    private httpService: HttpService,
    private shareDataService: ShareDataService) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
  }

  ngOnInit() {
    this.toastrService.success('Welcome on setting', 'Settings');
    this.httpService.get('username/').subscribe(data=>{
      this.userData.username = data.username;
    });

    this.httpService.get('referral-link/').subscribe(data=>{
      this.userData.link = data.link;
    });

    this.httpService.get('user_id/').subscribe(data=>{
      this.userData.user_id = data.user_id;
    });

    this.httpService.get('country/').subscribe(data=>{
      this.userData.country = data.country;
    });
  }

  openDialog(type: any, value:any) {
    this.newData(value);
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(data => {
        if (type == 'password' && data!=undefined && data!='') {
          let endpoint = 'password/';
          let apiData = { 'password' : data };
          this.updateSettingPageData(apiData, endpoint);
        }else if (type == 'country' && data!=undefined && data!='') {
          let endpoint = 'country/';
          let apiData = { 'country' : data };
          this.updateSettingPageData(apiData, endpoint);
        }
    });
  }


  updateSettingPageData(apiData: any, endpoint: string){
    this.httpService.postWithToken(apiData, endpoint)
    .subscribe(res=>{
      if (res.status == 'password reset') {
        this.toastrService.success('Password update successfully', 'Password');
      }else if (res.status =='country updated') {
        this.userData.country = apiData.country;
        this.toastrService.success('Country update successfully', 'Country');
      }
    }, err=>{
      console.log(err);
    });
  }


  newData(name: any) {
    this.shareDataService.changeData(name)
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.userImageBase64 = event.base64;
    this.croppedImage = event.base64;
    this.croppedImageSize = event.file;
  }

  loadImageFailed() {
    // show message
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog).onClose.subscribe(data=>{
      this.imageChangedEvent = '';
      this.croppedImage = '';
    });
  }

  uploadPicture(ref){
    const formData: FormData = new FormData();
    let file = this.imageChangedEvent.target.files[0];
    this.croppedImageSize;
    let newfile = new File([this.croppedImageSize], file.name);
    formData.append('avatar', newfile , newfile.name);
    this.httpService.uploadImage(formData, 'avatar-upload/').subscribe(res=>{
      if (res.status) {
        ref.close();
        this.userImage = this.userImageBase64;
        this.toastrService.success('User image change successfully', 'Picture updated');
      }
    });
  }
}
