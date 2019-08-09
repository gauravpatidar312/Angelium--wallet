import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ToastrService} from '../services/toastr.service';
import {TranslateService} from '@ngx-translate/core';
import {IndexedDBStorageService} from '../services/indexeddb-storage.service';

import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Store} from '@ngrx/store';
import {AppState, selectAuthState} from '../@core/store/app.state';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  getState = null;
  constructor(private authService: AuthService, private store: Store<AppState>,
              private toastrService: ToastrService,
              public translate: TranslateService,
              private router: Router,
              private storageService: IndexedDBStorageService) {
    this.getState = this.store.select(selectAuthState);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const self = this;
    return Observable.create((observer: any) => {
      setTimeout(function () {
        self.getState.subscribe((auth: any) => {
          if (auth.isAuthenticated) {
            observer.next(true);
            observer.complete();
          } else {
            self.router.navigate(['/']);
            observer.next(false);
            observer.complete();
          }
        });
      }, 300);
    });
  }

  /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.storageService.getSessionStorage()
      .then((user?: any) => {
        const url: string = state.url;
        const data: any = route.data;

        return new Promise<boolean>((resolve) => {
          if (user && url) {
            if (!data.role || data.role.indexOf(user.user_type) >= 0) {
              return resolve(true);
            } else {
              this.toastrService.danger(this.translate.instant('common.toastr.redirectPageText'), this.translate.instant('common.angelium'));
              this.router.navigate(['pages/dashboard']);
              return resolve(true);
            }
          } else {
            this.router.navigate(['/']);
            return resolve(false);
          }
        });
      });
  }*/
}
