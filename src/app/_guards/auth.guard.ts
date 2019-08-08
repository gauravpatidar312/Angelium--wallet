import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ToastrService} from '../services/toastr.service';
import {TranslateService} from '@ngx-translate/core';
import {IndexedDBStorageService} from '../services/indexeddb-storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private toastrService: ToastrService,
              public translate: TranslateService,
              private router: Router,
              private storageService: IndexedDBStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.storageService.getSessionStorage()
      .then((user?: any) => {
        const url: string = state.url;
        const data: any = route.data;

        return new Promise<boolean>((resolve) => {
          if (user && url) {
            if (!data.role || data.role.indexOf(user.user_type) >= 0) {
              resolve(true);
            } else {
              this.toastrService.danger(this.translate.instant('common.toastr.redirectPageText'), this.translate.instant('common.angelium'));
              this.router.navigate(['pages/dashboard']);
              resolve(true);
            }
          } else {
            this.router.navigate(['/']);
            resolve(false);
          }
        });
      });
  }
}
