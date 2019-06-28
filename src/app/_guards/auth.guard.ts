import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../@core/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  excludingUrls: Array<string>;

  getState = null;
  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {
    this.excludingUrls = ['/login', '/register', 'reset-password'];
    this.getState = this.store.select(selectAuthState);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // const currentUser = this.authService.isAuthenticated();
    
    return Observable.create((observer: any) => {
      this.getState.subscribe((auth: any) => {
        if (auth.isAuthenticated) {
            observer.next(true);
            observer.complete();
        } else {
          this.router.navigate(['/']);
          observer.next(false);
          observer.complete();
        }
      }, (err) => {
        console.log('canActivate');
      });
    });
    // console.log('Activate route', state.url);
    // if (currentUser) {
    //   return true;
    // }

    // // not logged in so redirect to login page with the return url
    // this.router.navigate(['']);
    // return false;
  }
}
