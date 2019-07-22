import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { SessionStorageService } from "../services/session-storage.service";
import { HttpService } from '../services/http.service';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../@core/store/app.state';
import { ResetState } from '../@core/store/actions/user.action';
import { ToastrService } from '../services/toastr.service';
import { ShareDataService } from '../services/share-data.service';
import { IndexedDBStorageService } from '../services/indexeddb-storage.service';

@Injectable()
export class AuthService {
  token: string;
  getState = null;
  isUserAuthenticated = false;
  errorMessage = '';

  constructor(
    private sessionStorage: SessionStorageService,
    private storageService: IndexedDBStorageService,
    private router: Router,
    private httpService: HttpService,
    private store: Store<AppState>,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
  ) {
    this.getState = this.store.select(selectAuthState);
    this.getState.subscribe((state) => {
      this.isUserAuthenticated = state.isAuthenticated;
      // console.log('Auth state', state.isAuthenticated);
    });
  }

  logIn(data: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.httpService.post(data, 'jwt/api-token-auth/').subscribe((res?: any) => {
        if (res.token) {
          this.sessionStorage.saveToSession('loggedIn', true);
          this.sessionStorage.saveToLocalStorage('rememberMe', data.rememberMe);
          observer.next(res);
          observer.complete();
        } else {
          observer.error(res);
          this.toastrService.danger(this.shareDataService.getErrorMessage(res), 'Login Failed');
        }
      }, err => {
        observer.error(err);
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'Login Failed');
      });
    });
  }

  getProfile(): Observable<any> {
    return this.httpService.get('profile/');
  }

  logout() {
    this.shareDataService.changeData('');
    this.sessionStorage.removeFromLocalStorage('rememberMe');
    this.storageService.resetStorage();
    this.store.dispatch(new ResetState({}));
  }

  isAuthenticated(): Boolean {
    console.log('Is Authenticated?', this.isUserAuthenticated);
    return this.isUserAuthenticated;
  }
}
