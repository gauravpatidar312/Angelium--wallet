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
  languageType: string = 'SELECT';
  languageData = [
    {'language': 'English', 'code': 'en'},
    {'language': 'Chinese', 'code': 'zh'},
    {'language': 'Japanese', 'code': 'ja'},
    {'language': 'Korean', 'code': 'ko'}
  ]

  @ViewChild('otpForm') otpForm: NgForm;

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
    var browserDetectLang = navigator.languages[2];
    var currectLang = this.languageData.find((data:any)=> {
      return data.code === browserDetectLang;
    });
    if (currectLang) {
      this.languageType = currectLang.language;
    }else{
      this.languageType = 'English';
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      invitation_code: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      otp_code: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      isAgree: [false],
    }, {
      validator: MustMatch('password', 'confirm_password'),
    });

    this.activatedRoute.params.subscribe(params => {
      this.registerForm.controls.invitation_code.setValue(params.invitation_code);
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

    if (!this.registerForm.value.isAgree) {
      this.toastrService.danger('Please check agree to the terms and condition box.', 'Register');
      return;
    }

    this.formSubmitting = true;
    this.httpService.post(this.registerForm.value, 'register/').subscribe(res => {
      this.sessionStorageService.saveToSession('userInfo', res);
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
  }
}
