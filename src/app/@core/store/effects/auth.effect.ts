import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router} from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '../../../@core/store/app.state';
import { AuthService } from '../../../_guards/auth.service';
import { AuthActionTypes, LogIn, LogInFailure, ResetState, UserInfo, SetUserProfile, UpdateUserInfo, AskOTPFor2FA } from '../actions/user.action';
import { IndexedDBStorageService } from '../../../services/indexeddb-storage.service';
import {SessionStorageService} from '../../../services/session-storage.service';
import { Location } from '@angular/common';
import {environment} from 'environments/environment';

import * as moment from 'moment';

@Injectable()
export class AuthEffects{

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private storageService: IndexedDBStorageService,
    private sessionStorage: SessionStorageService,
    private translate: TranslateService,
    location: Location,
  ) {
    this.router = router;
  }

  // effects go here
  @Effect()
  LogIn: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.LOGIN),
      map((action: LogIn) => action.payload),
      switchMap(payload => {
        return this.authService.logIn(payload)
          .map((data) => {
            if (data.token) {
              return new SetUserProfile({ token: data.token });
            } else {
              // return of(new LogInFailure({}));
              return this.store.dispatch(new LogInFailure({}));
            }
          })
          .catch((error) => {
            return of(new LogInFailure({ error }));
          });
      }),
    );

  @Effect({ dispatch: false })
  SetUserProfile: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SET_USER_PROFILE),
    map((action: SetUserProfile) => action.payload),
    switchMap((data: any) => {
      return this.authService.getProfile()
        .map(user => {
          user.token = data.token;
          if (user.is_2fa_enable) {
            return this.store.dispatch(new AskOTPFor2FA(user));
          } else {
            return this.store.dispatch(new UserInfo(user));
          }
        })
        .catch((error) => {
          return of(new LogInFailure({ error }));
        });
    })
  );

  @Effect({dispatch: false})
  UserInfo: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.USER_INFO),
    map((action: UserInfo) => action.payload),
    map((user?: any) => {
      user.user_language = user.user_language || {'id': 0, 'language': 'English', 'language_code': 'en'};
      this.storageService.saveToSession(user);
      this.sessionStorage.saveToLocalStorage('languageData', user.user_language);
      if (this.router.url !== '' && (this.router.url.includes('/login') || this.router.url.includes('/register') || this.router.url.includes('/reset-password'))) {
          this.translate.use(user.user_language.language_code);
          if ((this.sessionStorage.getSessionStorage('redirect_to') || '').toLowerCase() === 'xlove') {
            this.sessionStorage.removeFromSessionStorage('redirect_to');
            document.location.href = `${environment.xloveUrl}?login=success&nkt=${user.token}`;
          } else {
            if (moment.utc().utcOffset(8) >= moment.utc('2019-09-22T16:00').utcOffset(8) && moment.utc().utcOffset(8) < moment.utc('2019-09-24T16:00').utcOffset(8)) {
              this.sessionStorage.saveToLocalStorage('showUltraHeavenAlert', true);
            }
            this.router.navigate(['/pages/dashboard']);
          }
      }
    })
  );

  @Effect({ dispatch: false })
  UpdateUserInfo: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.UPDATE_USER_INFO),
    map((action: UserInfo) => action.payload),
    map((user) => {
      this.storageService.saveToSession(user);
      return of(user);
    })
  );

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );

  @Effect({ dispatch: false })
  AskOTPFor2FA: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.ASK_OTP_FOR_2FA)
  );

  @Effect({ dispatch: false })
  ResetState: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.RESET_STATE),
    map(() => {
      this.router.navigate(['/']);
    })
  );
}
