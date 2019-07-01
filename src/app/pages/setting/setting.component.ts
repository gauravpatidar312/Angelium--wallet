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
import { IndexedDBStorageService } from '../../services/indexeddb-storage.service';
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
  newUsername: any = '';
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
              private breakpointService: NbMediaBreakpointsService,
              private storageService: IndexedDBStorageService) {
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
    this.httpService.get('languages/').subscribe(res=>{
      this.languageData = res;
    });
    this.storageService.getLangFormIndexDb().subscribe((data)=>{
      this.selectedLang = data.language;
      this.translate.use(data.language_code);
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
    this.userData.user_language = lan;
    this.httpService.put({'user_language': lan.id }, 'update_userlang/')
      .subscribe(res=>{
        this.storageService.storeLangIndexDb(lan);
        this.toastrService.success(
          this.translate.instant('pages.setting.toastr.languageUpdateSuccessfully'), 
          this.translate.instant('pages.setting.language'));
      });
    this.sessionStorage.updateUserState(this.userData);
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
      this.toastrService.success(
        this.translate.instant('pages.setting.toastr.linkCopiedSuccessfully'), 
        this.translate.instant('pages.setting.referralLink'));
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

  onChangeUsername(ref: any) {
    if (!this.newUsername || !this.newUsername.trim()) {
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.pleaseEnterUsername'), 
        this.translate.instant('pages.setting.toastr.changeUsername')
      );
      return;
    }

    if (!(/^[a-zA-Z0-9!@#$%^_+\-\[\]~:|.]*$/.test(this.newUsername))) {
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.usernameMustEnglishWithoutSpace'), 
        this.translate.instant('pages.setting.toastr.changeUsername')
      );
      return;
    }

    const endpoint = 'username/';
    const apiData = {'username': this.newUsername};
    this.httpService.put(apiData, endpoint)
      .subscribe((res?: any) => {
        if (res.status) {
          ref.close();
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.usernameUpdatedSuccessfully'), 
            this.translate.instant('pages.setting.toastr.changeUsername')
          );
          this.userData.username = this.newUsername;
          this.sessionStorage.updateUserState(this.userData);
          this.newUsername = null;
        } else {
          this.toastrService.danger(ShareDataService.getErrorMessage(res), 
            this.translate.instant('pages.setting.toastr.changeUsername')
          );
        }
      }, err => {
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 
          this.translate.instant('pages.setting.toastr.changeUsername')
        );
      });
  }

  changeLoginPasswordDialog(ref: any) {
    if (!(this.oldLoginPassword && this.newLoginPassword && this.confirmLoginPassword)) {
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.enterValueInAllFields'), 
        this.translate.instant('pages.setting.toastr.changeLoginPassword')
      );
      return;
    }
    if (this.newLoginPassword !== this.confirmLoginPassword) {
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.passwordsDoNotMatch'), 
        this.translate.instant('pages.setting.toastr.changeLoginPassword')
      );
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
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.loginPasswordUpdated'), 
            this.translate.instant('pages.setting.toastr.changeLoginPassword')
          );
        } else {
          this.toastrService.danger(res.message, this.translate.instant('pages.setting.toastr.changeLoginPassword'));
        }
      }, err => {
        this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('pages.setting.toastr.changeLoginPassword'));
      });
  }

  changeTradePasswordDialog(ref: any) {
    if (!(this.oldTradePassword && this.newTradePassword && this.confirmTradePassword)) {
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.enterValueInAllFields'), 
        this.translate.instant('pages.setting.toastr.changeTradePassword')
      );
      return;
    }
    if (this.newTradePassword !== this.confirmTradePassword) {
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.passwordsDoNotMatch'), 
        this.translate.instant('pages.setting.toastr.changeTradePassword')
      );
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
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.tradePasswordUpdated'), 
            this.translate.instant('pages.setting.toastr.changeTradePassword')
          );
        } else {
          this.toastrService.danger(res.message, this.translate.instant('pages.setting.toastr.changeTradePassword'));
        }
      }, err => {
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 
          this.translate.instant('pages.setting.toastr.changeTradePassword')
        );
      });
  }

  cancelUsernameDialog(ref) {
    ref.close();
    this.newLoginPassword = null;
    this.oldLoginPassword = null;
    this.confirmLoginPassword = null;
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
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.r18ModeUpdated'), 
            this.translate.instant('pages.setting.toastr.r18ModeEnable')
          );
        } else {
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.r18ModeUpdated'), 
            this.translate.instant('pages.setting.toastr.r18ModeDisabled')
          );
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
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.countryUpdate'), 
            this.translate.instant('common.country')
          );
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
          this.toastrService.success(
            this.translate.instant('pages.setting.toastr.userImageChanged'),
            this.translate.instant('common.pictureUpdated')
          );
        }
      });
    }
  }
}
