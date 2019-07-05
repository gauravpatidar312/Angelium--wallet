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
import { AuthActionTypes, LogIn, LogInFailure, ResetState, UserInfo, SetUserProfile, UpdateUserInfo } from '../actions/user.action';
import { IndexedDBStorageService } from '../../../services/indexeddb-storage.service';
import {SessionStorageService} from '../../../services/session-storage.service';
import { Location } from "@angular/common";

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
          return this.store.dispatch(new UserInfo(user));
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
    map((user) => {
      this.storageService.saveToSession(user);
      this.sessionStorage.saveToLocalStorage('languageData', user.user_language);
      console.log('this.redirectUrl', this.router.url);
      if (this.router.url !== '' && (this.router.url === '/login' || this.router.url.includes('register') || this.router.url.includes('/reset-password'))) {
          this.translate.use(user.user_language.language_code);
          this.router.navigate(['/pages/dashboard']);
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
  ResetState: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.RESET_STATE),
    map(() => {
      this.router.navigate(['/']);
    })
  );
}
