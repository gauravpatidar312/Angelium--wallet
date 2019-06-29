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
      this.httpService.post(data, 'jwt/api-token-auth/').subscribe((res) => {
        if (res.token) {
          observer.next(res);
          observer.complete();
        } else {
          observer.error(res);
          this.toastrService.danger(ShareDataService.getErrorMessage(res), 'Login Failed');
        }
      }, err => {
        observer.error(err);
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Login Failed');
      });
    });
  }

  getProfile(): Observable<any> {
    return this.httpService.get('profile/');
  }

  logout() {
    this.storageService.resetStorage();
    this.store.dispatch(new ResetState({}));
    // this.router.navigate(['']);
  }

  isAuthenticated(): Boolean {
    console.log('Is Authenticated?', this.isUserAuthenticated);
    if (this.isUserAuthenticated) {
      return true;
    } else {
      return false;
    }

  }
}
