import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../@core/store/app.state';
import { AuthService } from '../../../_guards/auth.service';
import { AuthActionTypes, LogIn, LogInFailure, ResetState, UserInfo, SetUserProfile, UpdateUserInfo } from '../actions/user.action';
import { IndexedDBStorageService } from '../../../services/indexeddb-storage.service';

@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private storageService: IndexedDBStorageService,
  ) { }

  // effects go here
  @Effect()
  LogIn: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.LOGIN),
      map((action: LogIn) => action.payload),
      switchMap(payload => {
        return this.authService.logIn(payload)
          .map((data) => {
            return new SetUserProfile({ token: data.token });
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
              return this.store.dispatch(new UserInfo(user))
          })
          .catch((error) => {
            return of(new LogInFailure({ error }));
          });
      })
  );

  @Effect({ dispatch: false })
  UserInfo: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.USER_INFO),
    map((action: UserInfo) => action.payload),
    map((user) => {
      this.storageService.saveToSession(user);
      this.router.navigate(['pages/dashboard']);
    })
  );

  @Effect({ dispatch: false })
  UpdateUserInfo: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.UPDATE_USER_INFO),
    map((action: UserInfo) => action.payload),
    map((user) => {
      this.storageService.saveToSession(user);
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
      this.router.navigate(['']);
    })
  );
}
