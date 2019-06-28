import {HostListener, Component, OnInit, TemplateRef} from '@angular/core';
import {icons} from 'eva-icons';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService, NbDialogService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DialogNamePromptComponent} from './dialog-prompt/dialog-prompt.component';
import {ImageCroppedEvent} from './image-cropper/interfaces/image-cropped-event.interface';
import { TranslateService } from "@ngx-translate/core";
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {ShareDataService} from '../../services/share-data.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {environment} from '../../../environments/environment';
import Swal from 'sweetalert2';

export let browserRefresh = false;

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  isProduction: boolean = environment.production;
  evaIcons = [];
  selectedLang: string = 'SELECT';
  languageData = [
    // {'language': 'English', 'code': 'en'},
    // {'language': 'Chinese', 'code': 'zh'},
    // {'language': 'Japanese', 'code': 'ja'},
    // {'language': 'Korean', 'code': 'ko'}
  ]
  private alive = true;
  userData: any;
  imageChangedEvent: any = '';
  currentTheme: string;
  croppedImage: any = '';
  croppedImageSize: any = '';
  userImageBase64: any;
  r18modeSwitchText: boolean;
  newLoginPassword: any = '';
  confirmLoginPassword: any = '';
  oldLoginPassword: any = '';
  newTradePassword: any = '';
  confirmTradePassword: any = '';
  oldTradePassword: any = '';
  breakpoints: any;
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};

  constructor(private toastrService: ToastrService,
              private dialogService: NbDialogService,
              private httpService: HttpService,
              private shareDataService: ShareDataService,
              private sessionStorage: SessionStorageService,
              private router: Router,
              public translate: TranslateService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);

    window.onload = (ev) => {
      browserRefresh = true;
      this.getProfileData();
    };
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
    .pipe(takeWhile(() => this.alive))
    .subscribe(([oldValue, newValue]) => {
      this.breakpoint = newValue;
    });
    this.getLanguageData();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  getLanguageData(){
    this.httpService.getLanguage('languages/').subscribe(res=>{
      this.languageData = res;
      const userSettingInfo = this.sessionStorage.getFromSession('userInfo');
      this.selectedLang = userSettingInfo.user_language.language;
    });
  }

  getProfileData() {
    if (browserRefresh) {
      this.httpService.get('profile/').subscribe(data => {
        this.r18modeSwitchText = data.r18mode;
        this.userData = data;
      });
    }
  }
  
  changeLang(lan: any){
    this.selectedLang = lan.language;
    this.translate.use(lan.language_code);
  }

  ngOnInit() {
    const userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18modeSwitchText = userSettingInfo.r18mode;
    this.userData = userSettingInfo;
  }

  sweetAlertAgeCfrm() {
    Swal.fire({
      title: 'Age Confirmation',
      text: 'Are you really over 18?',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.userData.age_confirm = true;
        // this.sessionStorage.updateFromSession('userInfo', {'age_confirm': true});
        this.sessionStorage.updateUserState(this.userData);
        this.r18modeSwitchText = true;
        const data = {'r18mode': true, 'age_confirm': true};
        this.updateR18mode(data);
      } else {
        this.r18modeSwitchText = !this.r18modeSwitchText;
      }
    });
  }

  copyReferralLink() {
    if (this.userData.referral_link)
      this.toastrService.success('Link copied successfully!', 'Referral Link');
  }

  downloadQR() {
    const QR_Canvas = document.getElementById('QR_Canvas');
    const imgBase64 = QR_Canvas.children[0].children[0]['src'];
    const base64 = imgBase64.replace('data:image/png;base64,', '');

    const byteCharacters = atob(base64);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {'type': 'image/png'});
    if (navigator.msSaveBlob) {
      const filename = 'qrcode';
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('visibility', 'hidden');
      link.download = 'qrcode';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  changeLoginPasswordDialog(ref: any) {
    if (!(this.oldLoginPassword && this.newLoginPassword && this.confirmLoginPassword)) {
      this.toastrService.danger('Please enter value in all fields.', 'Change Login Password');
      return;
    }
    if (this.newLoginPassword !== this.confirmLoginPassword) {
      this.toastrService.danger('Passwords do not match.', 'Change Login Password');
      return;
    }
    const endpoint = 'change-password/';
    const apiData = {'old_password': this.oldLoginPassword, 'password': this.newLoginPassword};
    this.httpService.put(apiData, endpoint)
      .subscribe((res?: any) => {
        if (res.status) {
          ref.close();
          this.newLoginPassword = null;
          this.oldLoginPassword = null;
          this.confirmLoginPassword = null;
          this.toastrService.success('Login password updated successfully', 'Change Login Password');
        } else {
          this.toastrService.danger(res.message, 'Change Login Password');
        }
      }, err => {
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Change Login Password');
      });
  }

  changeTradePasswordDialog(ref: any) {
    if (!(this.oldTradePassword && this.newTradePassword && this.confirmTradePassword)) {
      this.toastrService.danger('Please enter value in all fields.', 'Change Trade Password');
      return;
    }
    if (this.newTradePassword !== this.confirmTradePassword) {
      this.toastrService.danger('Passwords do not match.', 'Change Trade Password');
      return;
    }
    const endpoint = 'change-trade-password/';
    const apiData = {'old_trade_password': this.oldTradePassword, 'trade_password': this.newTradePassword};
    this.httpService.put(apiData, endpoint)
      .subscribe((res?: any) => {
        if (res.status) {
          ref.close();
          this.newTradePassword = null;
          this.oldTradePassword = null;
          this.confirmTradePassword = null;
          this.toastrService.success('Trade password updated successfully', 'Change Trade Password');
        } else {
          this.toastrService.danger(res.message, 'Change Trade Password');
        }
      }, err => {
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Change Trade Password');
      });
  }

  cancelLoginPasswordDialog(ref) {
    ref.close();
    this.newLoginPassword = null;
    this.oldLoginPassword = null;
    this.confirmLoginPassword = null;
  }

  cancelTradePasswordDialog(ref) {
    ref.close();
    this.newTradePassword = null;
    this.oldTradePassword = null;
    this.confirmTradePassword = null;
  }

  updateR18mode(data: any) {
    this.httpService.put(data, 'r18mode/').subscribe((res?: any) => {
      if (res.status) {
        this.userData.r18mode = data.r18mode;
        // this.sessionStorage.updateFromSession('userInfo', data);
        this.sessionStorage.updateUserState(this.userData);
        if (data.r18mode) {
          this.toastrService.success('R-18 Mode updated successfully', 'R-18 MODE ENABLED');
        } else {
          this.toastrService.success('R-18 Mode updated successfully', 'R-18 MODE DISABLED');
        }
      }
    });
  }

  r18mode(event) {
    if (this.r18modeSwitchText !== event) {
      this.r18modeSwitchText = event;
      if (this.userData.age_confirm) {
        const data = {'r18mode': event, 'age_confirm': true};
        this.updateR18mode(data);
      } else {
        this.sweetAlertAgeCfrm();
      }
    }
  }

  openCountryDialog(type: any, value: any) {
    this.newData({'type': type, 'value': value});
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(data => {
      if (type === 'Country' && data) {
        const endpoint = 'country/';
        const apiData = {'country': data};
        this.updateSettingPageData(apiData, endpoint);
      }
    });
  }

  updateSettingPageData(apiData: any, endpoint: string) {
    this.httpService.post(apiData, endpoint)
      .subscribe(res => {
        if (res.status === 'country updated') {
          this.userData.country = apiData.country;
          // this.sessionStorage.updateFromSession('userInfo', apiData);
          this.sessionStorage.updateUserState(this.userData);
          this.toastrService.success('Country update successfully', 'Country');
        }
      }, err => {
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

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog,  {
      closeOnBackdropClick: false,
      autoFocus: false,
    });
  }

  cancelUploadDialog(ref) {
    ref.close();
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  uploadPicture(ref) {
    const formData: FormData = new FormData();
    if (this.imageChangedEvent !== '') {
      const file = this.imageChangedEvent.target.files[0];
      const newfile = new File([this.croppedImageSize], file.name, {type: file.type});
      formData.append('avatar', newfile, newfile.name);
      this.httpService.post(formData, 'avatar-upload/').subscribe((res?: any) => {
        if (res.status) {
          ref.close();
          this.shareDataService.changeData(res);
          this.userData.avatar = res.avatar;
          // this.sessionStorage.updateFromSession('userInfo', res);
          this.sessionStorage.updateUserState(this.userData);
          this.toastrService.success('User image change successfully', 'Picture updated');
        }
      });
    }
  }
}
