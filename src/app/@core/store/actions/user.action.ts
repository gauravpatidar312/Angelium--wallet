import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  SET_USER_PROFILE = '[Auth] Set User Profile',
  USER_INFO = '[Auth] User Info',
  UPDATE_USER_INFO = '[Auth] Update User Info',
  RESET_STATE = '[Auth] Reset State',
  LOGIN_FAILURE = '[Auth] Login Failure',
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any) {}
}

export class SetUserProfile implements Action {
  readonly type = AuthActionTypes.SET_USER_PROFILE;
  constructor(public payload: any) {}
}

export class UserInfo implements Action {
  readonly type = AuthActionTypes.USER_INFO;
  constructor(public payload: any) {}
}

export class UpdateUserInfo implements Action {
  readonly type = AuthActionTypes.UPDATE_USER_INFO;
  constructor(public payload: any) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: any) {}
}

export class ResetState implements Action {
  readonly type = AuthActionTypes.RESET_STATE;
  constructor(public payload: any) {}
}

export type All =
  | LogIn
  | LogInSuccess
  | SetUserProfile
  | UserInfo
  | UpdateUserInfo
  | ResetState
  | LogInFailure;
