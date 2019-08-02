import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ToastrService} from '../services/toastr.service';
import {TranslateService} from '@ngx-translate/core';
import {SessionStorageService} from '../services/session-storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private toastrService: ToastrService,
              public translate: TranslateService,
              private router: Router,
              private sessionStorage: SessionStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const self = this;
    return Observable.create((observer: any) => {
      const url: string = state.url;
      const data: any = route.data;
      const user = this.sessionStorage.getFromSession('userInfo');
      setTimeout(function () {
        if (user && url) {
          if (!data.role || data.role.indexOf(user.user_type) >= 0) {
            observer.next(true);
            observer.complete();
          } else {
            self.router.navigate(['pages/dashboard']);
            self.toastrService.danger(self.translate.instant('common.toastr.redirectPageText'), self.translate.instant('common.angelium'));
            observer.next(false);
            observer.complete();
          }
        } else {
          self.router.navigate(['/']);
          observer.next(false);
          observer.complete();
        }
      }, 600);
    });
  }
}
