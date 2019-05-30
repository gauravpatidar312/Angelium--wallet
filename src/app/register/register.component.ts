import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from "../services/http.service";
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../_helpers/must-match.validator';
// import services
import { SessionStorageService } from "../services/session-storage.service";


@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  registerForm: FormGroup;
  submitted:boolean = false;
  submittedOtp:boolean = false;
  @ViewChild('otpForm') otpForm: NgForm;
  
  constructor(
    private httpService: HttpService, 
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      validator: MustMatch('password', 'confirm_password')
    });
    
    this.activatedRoute.params.subscribe( params => {
      this.registerForm.controls.invitation_code.setValue(params.invitation_code);
    });
    
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.registerForm.controls.invitation_code.setValue(params.invitation_code);
    // });
  }

  get f() {
    return this.registerForm.controls;
  }

  get otp_form() {
    return this.otpForm.controls;
  }


  onSubmitOtp() {
    this.submittedOtp = true;
    if (this.otpForm.invalid) {
      return;
    }
    this.httpService.post(this.model, 'send-otp/').subscribe(res => {
      if (res['status'] == true) {
        alert('otp code has sent on your registered mobile no');
      }
    }, err => {
      if (err.status == 400) {
        alert(err.error.phone[0]);
      }
    });
  }

  onSubmitRegistration() {
    this.registerForm.controls.phone.setValue(this.model.phone);
    console.log(this.registerForm.value);
    this.submitted = true;
    this.submittedOtp = true;
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