import { Component, OnInit, TemplateRef } from '@angular/core';
import { icons } from 'eva-icons';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from './dialog-prompt/dialog-prompt.component';
import { ImageCroppedEvent } from './image-cropper/interfaces/image-cropped-event.interface';
import { ToastrService } from "../../services/toastr.service";
import { HttpService } from "../../services/http.service";
import { ShareDataService } from "../../services/share-data.service";
import { SessionStorageService } from "../../services/session-storage.service";

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  userData: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageSize: any = '';
  userImage: any;
  userImageBase64: any;
  constructor(
    private toastrService: ToastrService,
    private dialogService: NbDialogService,
    private httpService: HttpService,
    private shareDataService: ShareDataService,
    private sessionStorage: SessionStorageService) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
  }

  ngOnInit() {
    let userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    console.log(userSettingInfo);
    this.r18modeSwitchText = userSettingInfo.r18mode;
    this.userData = userSettingInfo;
  }

  r18modeSwitchText:boolean;
  r18mode(event){
    let data = { "r18mode": event };
    if (this.r18modeSwitchText != event) {
      this.r18modeSwitchText = event;
      this.httpService.putWithToken(data, 'r18mode/').subscribe(res=>{
        if (res.status) {
          this.sessionStorage.updateFromSession('userInfo', data);
          if (event) {
            this.toastrService.success('R-18 Mode update successfully', 'R-18 Mode ON'); 
          }else{
            this.toastrService.success('R-18 Mode update successfully', 'R-18 Mode OFF');
          }
        }
      });
    }
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
        this.sessionStorage.updateFromSession('userInfo', apiData);
        this.toastrService.success('Country update successfully', 'Country');
      }
    }, err=>{
      console.log(err);
    });
  }


  newData(name: any) {
    this.shareDataService.changeData(name);
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
    if (this.imageChangedEvent!='') {
      let file = this.imageChangedEvent.target.files[0];
      this.croppedImageSize;
      let newfile = new File([this.croppedImageSize], file.name);
      formData.append('avatar', newfile , newfile.name);

      this.httpService.uploadImage(formData, 'avatar-upload/').subscribe(res=>{
        if (res.status) {
          ref.close();
          this.shareDataService.changeData(res);
          this.userData.avatar = res.avatar;
          this.sessionStorage.updateFromSession('userInfo', res);
          this.toastrService.success('User image change successfully', 'Picture updated');
        }
      });
    }
  }
}
