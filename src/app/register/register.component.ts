import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// import services
import {ShareDataService} from '../services/share-data.service';
import {HttpService} from '../services/http.service';
import {ToastrService} from '../services/toastr.service';
import {SessionStorageService} from '../services/session-storage.service';
import { IndexedDBStorageService } from '../services/indexeddb-storage.service';
import { NbDialogService } from '@nebular/theme';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

declare let jQuery: any;

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  private alive = true;
  model: any = {};
  registerForm: FormGroup;
  submitted: boolean = false;
  formSubmitting: boolean = false;
  otpSubmitted: boolean = false;
  otpSubmitting: boolean = false;
  isResubmit: boolean = false;
  resubmitTime: number = 60 * 1000;
  currentTheme: string;
  breakpoints: any;
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  selectedLang: string = 'SELECT';
  languageData = [
    // {'language': 'English', 'code': 'en'},
    // {'language': 'Chinese', 'code': 'zh'},
    // {'language': 'Japanese', 'code': 'ja'},
    // {'language': 'Korean', 'code': 'ko'}
  ]

  @ViewChild('otpForm') otpForm: NgForm;

  isVerifiedCaptcha = false;

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private sessionStorageService: SessionStorageService,
              private dialogService: NbDialogService,
              private shareDataService: ShareDataService,
              private breakpointService: NbMediaBreakpointsService,
              private themeService: NbThemeService,
              public translate: TranslateService,
              private storageService: IndexedDBStorageService) {
    this.getCapchaTranslation();
  }

  getLanguageData(){
    this.httpService.get('languages/').subscribe(res=>{
      this.languageData = res;
    });
  }

  ngOnInit() {
    this.getLanguageData();
    jQuery(document).ready(() => {
      jQuery('#registerSlider').slideToUnlock({ useData: true});
      jQuery( document ).on('veryfiedCaptcha', (event, arg) => {
        if (arg === 'verified') {
          this.isVerifiedCaptcha = true;
          this.getCapchaTranslation();
        }
    });
   });
    this.registerForm = this.formBuilder.group({
      invitation_code: [''],
      email: ['', [Validators.required, Validators.email]],
      confirm_your_email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^_+\-\[\]~:|.]*$/)]],
      phone: ['', Validators.required],
      otp_code: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_ +\-=\[\]{};'~`:"\\|,.<>\/?]*$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_ +\-=\[\]{};'~`:"\\|,.<>\/?]*$/)]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      trade_password: ['', Validators.required],
      confirm_trade_password: ['', Validators.required],
      user_language: [''],
      isAgree: [false],
    });

    this.activatedRoute.params.subscribe( async(params?: any) => {
      let info: any = await this.storageService.getAngeliumStorage();
      if (params.invitation_code) {
        this.storageService.saveToAngeliumSession({'invitationCode': params.invitation_code});
        this.registerForm.controls.invitation_code.setValue(params.invitation_code);
      } else if (info) {
        if (info.invitationCode) {
          this.registerForm.controls.invitation_code.setValue(info.invitationCode);
        }
      }
    });

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

    var lang = this.sessionStorageService.getFromLocalStorage('languageData');
    if (!lang) {
      this.selectedLang = 'English';
      this.registerForm.controls.user_language.setValue(1);
    }else{
      this.selectedLang = lang.language;
      this.registerForm.controls.user_language.setValue(lang.id);
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  get f() {
    return this.registerForm.controls;
  }

  get otp_form() {
    return this.otpForm.controls;
  }

  onSubmitOtp() {
    if (this.otpForm.invalid) {
      this.toastrService.warning(this.translate.instant('pages.register.toastr.phoneNumberIsInvalid'),
      this.translate.instant('common.sendSMS'));
      return;
    }

    this.otpSubmitted = true;
    this.otpSubmitting = true;
    this.httpService.post(this.model, 'send-otp/').subscribe((res) => {
      this.isResubmit = true;
      this.otpSubmitting = false;

      if (res['status']) {
        setTimeout(() => {
          this.otpSubmitted = false;
          this.resubmitTime += (60 * 1000);
        }, this.resubmitTime);

        this.toastrService.success(this.translate.instant('pages.register.toastr.sentOTPtoMobile'),
        this.translate.instant('common.sendSMS'));
      }
    }, err => {
      this.otpSubmitting = false;
      this.otpSubmitted = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.sendSMS'));

    });
  }

  onSubmitRegistration() {
    if (!this.isVerifiedCaptcha) {
      this.toastrService.danger(
        this.translate.instant('pages.login.toastr.pleaseVerifyCaptcha'),
        this.translate.instant('common.register')
      );
      return;
    }
    this.registerForm.controls.phone.setValue(this.model.phone);
    console.log(this.registerForm.value);

    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid || this.otpForm.invalid) {
      return;
    }

    if (!this.isResubmit) {
      this.toastrService.danger(this.translate.instant('pages.register.toastr.pleaseSubmitOTPfirst'),
      this.translate.instant('common.register'));
      return;
    }
    if (this.registerForm.controls.email.value !== this.registerForm.controls.confirm_your_email.value) {
      this.toastrService.danger(this.translate.instant('pages.register.toastr.confirmEmailDoNotMatch'),
       this.translate.instant('common.register'));
      return;
    }
    if (this.registerForm.controls.password.value !== this.registerForm.controls.confirm_password.value) {
      this.toastrService.danger(this.translate.instant('pages.register.toastr.confirmLoginPasswordDoNotMatch'),
      this.translate.instant('common.register'));
      return;
    }
    if (this.registerForm.controls.trade_password.value !== this.registerForm.controls.confirm_trade_password.value) {
      this.toastrService.danger(this.translate.instant('pages.register.toastr.confirmTradePasswordDoNotMatch'), this.translate.instant('common.register'));
      return;
    }

    if (!this.registerForm.value.isAgree) {
      this.toastrService.danger(this.translate.instant('pages.register.toastr.pleaseCheckAgreetoTermsandConditionBox'),
      this.translate.instant('common.register'));
      return;
    }

    delete this.registerForm.value.confirm_trade_password;
    delete this.registerForm.value.confirm_your_email;

    this.formSubmitting = true;
    this.httpService.post(this.registerForm.value, 'register/').subscribe(res => {
      this.storageService.saveToAngeliumSession({'invitationCode': null });
      this.sessionStorageService.updateUserStateWithToken(res);
      // this.sessionStorageService.saveToSession('userInfo', res);
      // this.sessionStorageService.deleteFromSession('invitationCode');
      // this.getUserSettingInfo();
    }, err => {
      console.log(err);
      this.formSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err),
        this.translate.instant('pages.register.toastr.RegisterFailed'));

    });
  }

  // getUserSettingInfo() {
  //   this.httpService.get('profile/').subscribe(data => {
  //     this.sessionStorageService.updateFromSession('userInfo', data);
  //     this.router.navigate(['pages/dashboard']);
  //   }, err => {
  //     console.log(err);
  //     this.formSubmitting = false;
  //     this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Profile');
  //   });
  // }

  openTermsConditions() {
    this.dialogService.open(TermsConditionsComponent,  {
      closeOnBackdropClick: false,
    });
  }

  changeLanguage(lan: any){
    this.selectedLang = lan.language;
    this.translate.use(lan.language_code);
    this.registerForm.controls.user_language.setValue(lan.id);
    this.sessionStorageService.saveToLocalStorage('languageData', lan);
    this.getCapchaTranslation();
  }

  getCapchaTranslation(){
    if (this.isVerifiedCaptcha) {
      setTimeout(()=>{
        jQuery('#registerSlider').children('.text').text(
          this.translate.instant('common.verified'));
      },0);
    }else{
      setTimeout(()=>{
        jQuery('#registerSlider').children('.text').text(
          this.translate.instant('common.slideRightToVerify'));
      },1000);
    }
  }
}
