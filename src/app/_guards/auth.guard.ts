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
  user: any;

  constructor(private toastrService: ToastrService,
              public translate: TranslateService,
              private router: Router,
              private sessionStorage: SessionStorageService) {
    this.user = this.sessionStorage.getFromSession('userInfo');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.create((observer: any) => {
      const url: string = state.url;
      const data: any = route.data;
      if (!this.user)
        this.user = this.sessionStorage.getFromSession('userInfo');

      setTimeout(() => {
        if (this.user && url) {
          if (!data.role || data.role.indexOf(this.user.user_type) >= 0) {
            observer.next(true);
            observer.complete();
          } else {
            this.toastrService.danger(this.translate.instant('common.toastr.redirectPageText'), this.translate.instant('common.angelium'));
            this.router.navigate(['pages/dashboard']);
            observer.next(true);
            observer.complete();
          }
        } else {
          this.router.navigate(['/']);
          observer.next(false);
          observer.complete();
        }
      }, 0);
    });
  }
}
