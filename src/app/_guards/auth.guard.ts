import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
    excludingUrls: Array<string>;

    constructor(private authService: AuthService, private router: Router) {
      this.excludingUrls = ['/login', '/register', 'reset-password'];
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
        const currentUser = this.authService.isAuthenticated();
        if (currentUser) {
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['']);
        return false;
    }
}
