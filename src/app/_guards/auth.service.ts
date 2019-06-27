import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SessionStorageService } from "../services/session-storage.service";

@Injectable()
export class AuthService {
  token: string;

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {}

  logout() {
    this.sessionStorage.resetSession();
    this.router.navigate(['']);
  }

  isAuthenticated(): Boolean {
    let userInfo = this.sessionStorage.getFromSession("userInfo");
    if (userInfo) {
      return true;
    } else {
      return false;
    }
  }
}
