import { HostListener, Component, OnInit, TemplateRef } from '@angular/core';
import { icons } from 'eva-icons';
import { NbDialogService } from '@nebular/theme';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogNamePromptComponent } from './dialog-prompt/dialog-prompt.component';
import { ImageCroppedEvent } from './image-cropper/interfaces/image-cropped-event.interface';

import { ToastrService } from "../../services/toastr.service";
import { HttpService } from "../../services/http.service";
import { ShareDataService } from "../../services/share-data.service";
import { SessionStorageService } from "../../services/session-storage.service";
import { environment } from "../../../environments/environment";
import Swal from 'sweetalert2';

export let browserRefresh = false;

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  production:boolean;
  userData: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageSize: any = '';
  userImage: any;
  userImageBase64: any;
  r18modeSwitchText:boolean;

  constructor(
    private toastrService: ToastrService,
    private dialogService: NbDialogService,
    private httpService: HttpService,
    private shareDataService: ShareDataService,
    private sessionStorage: SessionStorageService,
    private router: Router) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
    this.production = environment.production;
    
    window.onload = (ev) => {
      browserRefresh = true;
      this.getProfileData();
    };
  }

  getProfileData(){
    if (browserRefresh) {
      this.httpService.get('profile/').subscribe(data => {
        this.r18modeSwitchText = data.r18mode;
        this.userData = data;
      });
    }
  }

  ngOnInit() {
    let userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18modeSwitchText = userSettingInfo.r18mode;
    this.userData = userSettingInfo;
  }

  sweetAlert(){
    Swal.fire({
      title: 'Age Confirmation',
      text: 'Are you really over 18?',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.r18modeSwitchText = true; 
        let data = { "r18mode": true };
        this.updateR18mode(data);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.r18modeSwitchText = false;
        let data = { "r18mode": false };
        this.updateR18mode(data);
      }else if (result.dismiss === Swal.DismissReason.backdrop) {
        this.r18modeSwitchText = !this.r18modeSwitchText;
      }
    });
  }

  updateR18mode(data: any){
    this.httpService.putWithToken(data, 'r18mode/').subscribe(res=>{
      if (res.status) {
        this.sessionStorage.updateFromSession('userInfo', data);
        if (data.r18mode) {
          this.toastrService.success('R-18 Mode updated successfully', 'R-18 MODE ENABLED');
        }else{
          this.toastrService.success('R-18 Mode updated successfully', 'R-18 MODE DISABLED');
        }
      }
    });
  }

  r18mode(event){
    let data = { "r18mode": event };
    if (this.r18modeSwitchText != event) {
      this.r18modeSwitchText = event;
      this.sweetAlert();
    }
  }

  openDialog(type: any, value:any) {
    this.newData({ 'type': type, 'value': value});
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(data => {
        if (type == 'Change Password' && data!=undefined && data!='') {
          let endpoint = 'password/';
          let apiData = { 'password' : data };
          this.updateSettingPageData(apiData, endpoint);
        }else if (type == 'County' && data!=undefined && data!='') {
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
      let newfile = new File([this.croppedImageSize], file.name, {type: file.type});
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
