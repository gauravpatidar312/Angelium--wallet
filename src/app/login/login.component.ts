import {Component, TemplateRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NbDialogService} from '@nebular/theme';
import {ToastrService} from '../services/toastr.service';
import {HttpService} from '../services/http.service';
import {ShareDataService} from '../services/share-data.service';
import {Store} from '@ngrx/store';
import {MessagingService} from '../messaging.service';
import {LogIn, UserInfo} from '../@core/store/actions/user.action';
import {AppState} from '../@core/store/app.state';
import {AuthEffects} from '../@core/store/effects/auth.effect';

declare let jQuery: any;
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loginForm: FormGroup;
  submitted: boolean = false;
  formSubmitting: boolean = false;
  otpSubmitting: boolean = false;
  isVerifiedCaptcha = false;
  rememberMe: boolean = false;
  tfaOtp: string;
  user: any;
  otpDialog: any;

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              public translate: TranslateService,
              private dialogService: NbDialogService,
              private store: Store<AppState>,
              private authEffects: AuthEffects,
              private msgService: MessagingService,
              private httpService: HttpService,
              private shareDataService: ShareDataService) {
    // const currentUser = this.authService.isAuthenticated();
    // if (currentUser) {
    //   this.router.navigate(['/pages/setting']);
    // }
    this.getCapchaTranslation();
  }

  ngOnInit() {
    jQuery(document).ready(() => {
      jQuery("#loginSlider").slideToUnlock({useData: true});
      jQuery(document).on("veryfiedCaptcha", (event, arg) => {
        if (arg === 'verified') {
          this.isVerifiedCaptcha = true;
          this.getCapchaTranslation();
        }
      });
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      dev_id: [''],
      rememberMe: [false]
    });

    this.authEffects.AskOTPFor2FA.subscribe((res?: any) => {
      this.user = res.payload;
      this.dialogService.open(this.otpDialog, {
        closeOnBackdropClick: false,
        autoFocus: false,
      }).onClose.subscribe(data => {
        if (data) {
          return this.store.dispatch(new UserInfo(this.user));
        } else {
          this.formSubmitting = false;
        }
      });
    });
    this.authEffects.LogInFailure.subscribe((res?: any) => {
      this.formSubmitting = false;
    });
  }

  getCapchaTranslation() {
    if (this.isVerifiedCaptcha) {
      setTimeout(() => {
        jQuery('#loginSlider').children('.text').text(
          this.translate.instant('common.verified'));
      }, 0);
    } else {
      setTimeout(() => {
        jQuery('#loginSlider').children('.text').text(
          this.translate.instant('common.slideRightToVerify'));
      }, 1200);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  verifyOTP(ref: any) {
    if (!this.tfaOtp)
      return;

    const data = {
      'email': this.user.email,
      'otp': this.tfaOtp
    };

    this.otpSubmitting = true;
    this.httpService.post(data, 'verify-2fa-otp/').subscribe((res?: any) => {
      if (res.status) {
        ref.close(true);
      } else {
        this.otpSubmitting = false;
        this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('pages.setting.2FA'));
      }
    }, (err) => {
      this.otpSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.setting.2FA'));
    });
  }

  onSubmitLogin(dialog: TemplateRef<any>) {
    this.loginForm.controls.dev_id.setValue(this.msgService.token);

    if (!this.isVerifiedCaptcha) {
      this.toastrService.danger(this.translate.instant('pages.login.toastr.pleaseVerifyCaptcha'), this.translate.instant('pages.login.login'));
      return;
    }
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.otpDialog = dialog;
    this.formSubmitting = true;
    this.store.dispatch(new LogIn(this.loginForm.value));
  }
}
