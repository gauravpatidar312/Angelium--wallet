import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
// import custom validator to validate that password and confirm password fields match
import {MustMatch} from '../_helpers/must-match.validator';
// import services
import {ShareDataService} from '../services/share-data.service';
import {HttpService} from '../services/http.service';
import {ToastrService} from '../services/toastr.service';
import {SessionStorageService} from '../services/session-storage.service';
import { NbDialogService } from '@nebular/theme';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
declare let $: any;
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
  languageCode: any;
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  languageType: string = 'SELECT';
  languageData = [
    {'language': 'English', 'code': 'en'},
    {'language': 'Chinese', 'code': 'zh'},
    {'language': 'Japanese', 'code': 'ja'},
    {'language': 'Korean', 'code': 'ko'}
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
              private breakpointService: NbMediaBreakpointsService,
              private themeService: NbThemeService,
              public translate: TranslateService) {
    var browserDetectLang = navigator.language.split("-")[0];
    
    var currectLang = this.languageData.find((data:any)=> {
      return data.code === browserDetectLang;
    });
    if (currectLang) {
      this.languageType = currectLang.language;
      this.languageCode = currectLang.code; 
      this.translate.use(currectLang.code);
    }else{
      this.languageType = 'English';
      this.languageCode = 'en';
      this.translate.use('en');
    }
  }

  ngOnInit() {
    $(document).ready(() => {
      $("#registerSlider").slideToUnlock({ useData: true});
      $( document ).on("veryfiedCaptcha", (event, arg) => {
        if (arg === 'verified') {
          this.isVerifiedCaptcha = true;
          this.getCapchaTranslation();
        }
    });
   });
    this.registerForm = this.formBuilder.group({
      invitation_code: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_ +\-=\[\]{};'~`:"\\|,.<>\/?]*$/)]],
      phone: ['', Validators.required],
      otp_code: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_ +\-=\[\]{};'~`:"\\|,.<>\/?]*$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_ +\-=\[\]{};'~`:"\\|,.<>\/?]*$/)]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      trade_password: ['', Validators.required],
      confirm_trade_password: ['', Validators.required],
      language: [this.languageType],
      language_code: [this.languageCode],
      isAgree: [false],
    });

    this.activatedRoute.params.subscribe((params?: any) => {
      if (params.invitation_code) {
        this.sessionStorageService.saveToSession('invitationCode', params.invitation_code);
        this.registerForm.controls.invitation_code.setValue(params.invitation_code);
      } else if (this.sessionStorageService.getFromSession('invitationCode')) {
        this.registerForm.controls.invitation_code.setValue(this.sessionStorageService.getFromSession('invitationCode'));
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
      this.toastrService.warning('Phone number is invalid.', 'Send SMS');
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

        this.toastrService.success('We\'ve sent an OTP code to your phone number.', 'Send SMS');
      }
    }, err => {
      this.otpSubmitting = false;
      this.otpSubmitted = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Send SMS');
    });
  }

  onSubmitRegistration() {
    if (!this.isVerifiedCaptcha) {      
      this.toastrService.danger('Please verify captcha', 'Register');
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
      this.toastrService.danger('Please submit OTP first.', 'Register');
      return;
    }
    if (this.registerForm.controls.password.value !== this.registerForm.controls.confirm_password.value) {
      this.toastrService.danger('Confirm login password do not match', 'Register');
      return;
    }
    if (this.registerForm.controls.trade_password.value !== this.registerForm.controls.confirm_trade_password.value) {
      this.toastrService.danger('Confirm trade password do not match', 'Register');
      return;
    }

    if (!this.registerForm.value.isAgree) {
      this.toastrService.danger('Please check agree to the terms and condition box.', 'Register');
      return;
    }

    delete this.registerForm.value.confirm_trade_password;
    this.formSubmitting = true;
    this.httpService.post(this.registerForm.value, 'register/').subscribe(res => {
      this.sessionStorageService.saveToSession('userInfo', res);
      this.sessionStorageService.deleteFromSession('invitationCode');
      this.getUserSettingInfo();
    }, err => {
      console.log(err);
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Register Failed');
    });
  }

  getUserSettingInfo() {
    this.httpService.get('profile/').subscribe(data => {
      this.sessionStorageService.updateFromSession('userInfo', data);
      this.router.navigate(['pages/dashboard']);
    }, err => {
      console.log(err);
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Profile');
    });
  }

  openTermsConditions() {
    this.dialogService.open(TermsConditionsComponent,  {
      closeOnBackdropClick: false,
    });
  }

  changeLanguage(lan: any){
    this.languageType = lan.language;
    this.translate.use(lan.code);
    this.registerForm.controls.language.setValue(lan.language);
    this.registerForm.controls.language_code.setValue(lan.code);
    this.getCapchaTranslation();
  }

  getCapchaTranslation(){
    this.translate.get('common').subscribe((res)=>{
      if (this.isVerifiedCaptcha) {
        setTimeout(function(){
          $("#registerSlider").children(".text").text(res.verified);
        },0);
      }else{
        setTimeout(function(){
          $("#registerSlider").children(".text").text(res.slideRightToVerify);
        },0);
      }
    });
  }
}
