/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
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
              public translate: TranslateService,
              private sessionStorage: SessionStorageService) {
    
    
    router.events.subscribe((event?: any) => {
      if (event instanceof NavigationStart) {
        const userData = this.sessionStorage.getFromSession('userInfo');
        this.setLanguage(userData);
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

  setLanguage(userData) {
    var langArr = ['en', 'ko', 'zh'];
    var browserDetectLang = navigator.language.split("-")[0];
    var currectLang = langArr.find((data:any)=> {
      return data === browserDetectLang;
    });
    if (userData) {
      this.translate.use(userData.user_language.language_code);
    }else{
      if (currectLang) {
        this.translate.use(currectLang);
      }else{
        this.translate.setDefaultLang('en');
      }
    }
  }
}
