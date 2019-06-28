import { Component, OnInit } from '@angular/core';
import {SessionStorageService} from '../services/session-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  constructor( private router: Router,
               private sessionStorage: SessionStorageService) { }

  ngOnInit() {
  }
  redirectPage() {
    const userData = this.sessionStorage.getFromSession('userInfo');
    if (userData)
      this.router.navigate(['/pages/dashboard']);
    else
      this.router.navigate(['']);
  }
}
