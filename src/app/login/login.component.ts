import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ShareDataService} from '../services/share-data.service';
import {HttpService} from '../services/http.service';
import {SessionStorageService} from '../services/session-storage.service';
import {ToastrService} from '../services/toastr.service';
import {AuthService} from '../_guards/auth.service';

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

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private router: Router,
              private sessionStorageService: SessionStorageService,
              private toastrService: ToastrService,
              private authService: AuthService) {
    const currentUser = this.authService.isAuthenticated();
    if (currentUser) {
      this.router.navigate(['/pages/setting']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmitLogin() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    this.httpService.post(this.loginForm.value, 'jwt/api-token-auth/').subscribe((res?: any) => {
      if (res.token) {
        this.sessionStorageService.saveToSession('userInfo', res);
        if (this.sessionStorageService.getFromSession('invitationCode')) {
          this.sessionStorageService.deleteFromSession('invitationCode');
        }
        this.getUserSettingInfo();
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(ShareDataService.getErrorMessage(res), 'Login Failed');
      }
    }, err => {
      console.log(err);
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Login Failed');
    });
  }

  getUserSettingInfo() {
    this.httpService.get('profile/').subscribe(data => {
      this.sessionStorageService.updateFromSession('userInfo', data);
      this.router.navigate(['pages/dashboard']);
    });
  }
}
