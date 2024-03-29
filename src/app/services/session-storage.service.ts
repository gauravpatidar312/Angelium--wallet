import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../@core/store/app.state';
import { SetUserProfile, UpdateUserInfo } from '../@core/store/actions/user.action';

@Injectable({
  providedIn: "root"
})
export class SessionStorageService {
  getState = null;
  private userInfo = null;
  constructor(
    private store: Store<AppState>
  ) {
    this.getState = this.store.select(selectAuthState);
    this.getState.subscribe((state) => {
      this.userInfo = state.user;
    });
  }

  // call this function when you set new user register and need to set profile .
  // Pass token then its call => profile api and set user profile in our store state.
  // It used in register & reset-password page.
  updateUserStateWithToken(data) {
    this.store.dispatch(new SetUserProfile({ token: data.token }));
  }

  // call this function when you have to update existing user data.
  // pass whole updated user data to update it update our store state.
  // It used in setting page
  updateUserState(data) {
    this.store.dispatch(new UpdateUserInfo(data));
  }

  // call this function for get user profile detail from our store state.
  getFromSession =  function(key): any {
    return this.userInfo;
  };

  saveToSession = function(key, value) {
    sessionStorage[key] = JSON.stringify(value);
  };

  saveToLocalStorage = function(key, value) {
    localStorage[key] = JSON.stringify(value);
  };

  getSessionStorage = function(key): any {
    if (sessionStorage[key]) {
      return JSON.parse(sessionStorage[key]);
    } else {
      return false;
    }
  };

  getFromLocalStorage = function(key): any {
    if (localStorage[key]) {
      return JSON.parse(localStorage[key]);
    } else {
      return false;
    }
  };

  removeFromLocalStorage = function(key): any {
    localStorage.removeItem(key);
  };

  removeFromSessionStorage = function(key): any {
    sessionStorage.removeItem(key);
  };
}
