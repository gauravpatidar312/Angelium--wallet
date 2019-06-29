import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
// import custom validator to validate that password and confirm password fields match
import {MustMatch} from '../_helpers/must-match.validator';
// import services
import {HttpService} from '../services/http.service';
import {ToastrService} from '../services/toastr.service';
import {SessionStorageService} from '../services/session-storage.service';
import {ShareDataService} from '../services/share-data.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})

export class ResetPasswordComponent implements OnInit {
  model: any = {};
  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  formSubmitting: boolean = false;
  otpSubmitted: boolean = false;
  otpSubmitting: boolean = false;
  isResubmit: boolean = false;
  resubmitTime: number = 60 * 1000;
  @ViewChild('otpForm') otpForm: NgForm;

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private sessionStorageService: SessionStorageService,
              private translate:TranslateService) {

  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      invitation_code: [''],
      phone: ['', Validators.required],
      code: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirm_password'),
    });

    this.activatedRoute.params.subscribe(params => {
      this.resetPasswordForm.controls.invitation_code.setValue(params.invitation_code);
    });
  }

  get f() {
    return this.resetPasswordForm.controls;
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
    this.httpService.post(this.model, 'forgot-password/').subscribe((res) => {
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

  onSubmitResetPassword() {
    this.resetPasswordForm.controls.phone.setValue(this.model.phone);
    console.log(this.resetPasswordForm.value);

    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid || this.otpForm.invalid) {
      return;
    }

    if (!this.isResubmit) {
      this.toastrService.danger('Please submit OTP first.', 'Register');
      return;
    }

    this.formSubmitting = true;
    this.httpService.post(this.resetPasswordForm.value, 'verify-forgotpassword-otp/').subscribe(res => {
      if (res.status) {
        // this.sessionStorageService.saveToSession('userInfo', res.data);
        // this.getUserSettingInfo();
        this.sessionStorageService.updateUserStateWithToken(res.data);
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(res.message || 'Please check OTP code and try again!', 'Reset Password');
      }
    }, err => {
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Reset Password');
      console.log(err);
    });
  }

  // getUserSettingInfo() {
  //   this.httpService.get('profile/').subscribe(data => {
  //     this.sessionStorageService.updateFromSession('userInfo', data);
  //     this.router.navigate(['pages/dashboard']);
  //   });
  // }
}
