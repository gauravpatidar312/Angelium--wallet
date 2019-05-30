import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
// import custom validator to validate that password and confirm password fields match
import {MustMatch} from '../_helpers/must-match.validator';
// import services
import {HttpService} from '../services/http.service';
import {ToastrService} from '../services/toastr.service';
import {SessionStorageService} from '../services/session-storage.service';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  model: any = {};
  registerForm: FormGroup;
  submitted: boolean = false;
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
              private sessionStorageService: SessionStorageService) {

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      invitation_code: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      otp_code: ['', Validators.required],
      full_name: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirm_password'),
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.registerForm.controls.invitation_code.setValue(params.invitation_code);
    });
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
    this.httpService.post(this.model, 'send-otp/').subscribe(res => {
      this.otpSubmitting = false;
      this.isResubmit = true;

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
      if (err.status === 400) {
        this.toastrService.danger('OTP code has been sent to your phone number.', 'Send SMS');
      }
    });
  }

  onSubmitRegistration() {
    this.registerForm.controls.phone.setValue(this.model.phone);
    console.log(this.registerForm.value);

    this.submitted = true;
    this.otpSubmitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid && this.otpForm.invalid) {
      return;
    }
    // this.httpService.post(this.registerForm.value, 'register/').subscribe(res=>{
    //   this.sessionStorageService.saveToSession('userInfo', res);
    //   this.router.navigate(['pages/setting']);
    // }, err => {
    //   console.log(err);
    // });
  }
}
