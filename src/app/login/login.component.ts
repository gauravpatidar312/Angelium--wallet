import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {ShareDataService} from '../services/share-data.service';
import {HttpService} from '../services/http.service';
import {SessionStorageService} from '../services/session-storage.service';
import {ToastrService} from '../services/toastr.service';
import {AuthService} from '../_guards/auth.service';
import {Store} from '@ngrx/store';
import {LogIn} from '../@core/store/actions/user.action';
import {AppState, selectAuthState} from '../@core/store/app.state';
import { AuthEffects } from '../@core/store/effects/auth.effect';
import {MessagingService} from '../messaging.service';

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
  isVerifiedCaptcha = false;

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private router: Router,
              private sessionStorageService: SessionStorageService,
              private toastrService: ToastrService,
              public translate: TranslateService,
              private authService: AuthService,
              private store: Store<AppState>,
              private authEffects: AuthEffects,
              private msgService: MessagingService) {
    // const currentUser = this.authService.isAuthenticated();
    // if (currentUser) {
    //   this.router.navigate(['/pages/setting']);
    // }
    this.getCapchaTranslation();
  }

  ngOnInit() {
    jQuery(document).ready(() => {
      jQuery("#loginSlider").slideToUnlock({ useData: true});
      jQuery( document ).on("veryfiedCaptcha", (event, arg) => {
        if (arg === 'verified') {
          this.isVerifiedCaptcha = true;
          this.getCapchaTranslation();
        }
      });
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      dev_id: ['']
    });
  }


  getCapchaTranslation(){
    if (this.isVerifiedCaptcha) {
      setTimeout(()=>{
        jQuery("#loginSlider").children(".text").text(
          this.translate.instant('common.verified'));
      },0);
    }else{
      setTimeout(()=>{
        jQuery("#loginSlider").children(".text").text(
          this.translate.instant('common.slideRightToVerify'));
      },1000);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmitLogin() {
    var token = await this.msgService.getToken();
    this.loginForm.controls.dev_id.setValue(token);
    
    if (!this.isVerifiedCaptcha) {
      this.toastrService.danger(this.translate.instant('pages.login.toastr.pleaseVerifyCaptcha'), this.translate.instant('pages.login.login'));
      return;
    }
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    this.store.dispatch(new LogIn(this.loginForm.value));
    this.authEffects.LogInFailure.subscribe(res => {
      if (res.hasOwnProperty('payload')) {
        if (res.payload.hasOwnProperty('error')) {
          this.formSubmitting = false;
        }
      }
    });
    // this.httpService.post(this.loginForm.value, 'jwt/api-token-auth/').subscribe((res?: any) => {
    //   if (res.token) {
    //     this.sessionStorageService.saveToSession('userInfo', res);
    //     if (this.sessionStorageService.getFromSession('invitationCode')) {
    //       this.sessionStorageService.deleteFromSession('invitationCode');
    //     }
    //     this.getUserSettingInfo();
    //   } else {
    //     this.formSubmitting = false;
    //     this.toastrService.danger(ShareDataService.getErrorMessage(res), 'Login Failed');
    //   }
    // });
    // this.httpService.post(this.loginForm.value, 'jwt/api-token-auth/').subscribe((res?: any) => {
    //   if (res.token) {
    //     this.sessionStorageService.saveToSession('userInfo', res);
    //     if (this.sessionStorageService.getFromSession('invitationCode')) {
    //       this.sessionStorageService.deleteFromSession('invitationCode');
    //     }
    //     this.getUserSettingInfo();
    //   } else {
    //     this.formSubmitting = false;
    //     this.toastrService.danger(ShareDataService.getErrorMessage(res), 'Login Failed');
    //   }
    // });
  }

  // getUserSettingInfo() {
  //   this.httpService.get('profile/').subscribe(data => {
  //     this.router.navigate(['pages/dashboard']);
  //   });
  // }
}
