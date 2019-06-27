/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {NavigationStart, Router} from '@angular/router';
import {HttpService} from './services/http.service';
import {SessionStorageService} from './services/session-storage.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private analytics: AnalyticsService,
              private httpService: HttpService,
              private router: Router,
              private sessionStorage: SessionStorageService) {
    router.events.subscribe((event?: any) => {
      if (event instanceof NavigationStart) {
        const userData = this.sessionStorage.getFromSession('userInfo');
        if (!userData || (userData && !userData.is_admin)) {
          this.httpService.get('maintenance/').subscribe((res?: any) => {
            if (res.is_under_maintenance) {
              if (event.url !== '/maintenance')
                this.router.navigate(['/maintenance']);
            }
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
