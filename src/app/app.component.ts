/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AnalyticsService} from './@core/utils/analytics.service';
import {NavigationStart, Router} from '@angular/router';
import {HttpService} from './services/http.service';
import {SessionStorageService} from './services/session-storage.service';
import {IndexedDBStorageService} from './services/indexeddb-storage.service';
import {AuthService} from './_guards/auth.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService,
              private httpService: HttpService,
              private router: Router,
              public translate: TranslateService,
              private sessionStorage: SessionStorageService,
              private storageService: IndexedDBStorageService,
              private authService: AuthService) {
    router.events.subscribe((event?: any) => {
      if (event instanceof NavigationStart) {
        const userData = this.sessionStorage.getFromSession('userInfo');
        if (!userData || (userData && !userData.is_admin)) {
          this.httpService.get('maintenance/').subscribe((res?: any) => {
            if (res.is_under_maintenance) {
              if (event.url !== '/maintenance')
                this.router.navigate(['/maintenance']);
            } else if (event.url === '/maintenance') {
              if (userData)
                this.router.navigate(['/pages/dashboard']);
              else
                this.router.navigate(['']);
            }
          });
        }
      }
    });
    
    var lang = this.sessionStorage.getFromLocalStorage('languageData');
    this.setLanguage(lang);
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }

  setLanguage(data: any) {
    console.log(data);
    if (!data) {
      let languages = [
        { 'id': 1, 'language': 'english', 'language_code': 'en' },
        { 'id': 2, 'language': 'Chinese', 'language_code': 'zh' },
        { 'id': 3, 'language': 'Korean', 'language_code': 'ko' }
      ]
      var browserDetectLang = navigator.language.split('-')[0];
      var currectLang = languages.find((data:any)=> {
        return data.language_code === browserDetectLang;
      });
      if (currectLang) {
        this.translate.use(currectLang.language_code);
        this.sessionStorage.saveToLocalStorage('languageData', currectLang);
      }else{
        let language = {id: 1, language: 'english', language_code: 'en'};
        this.sessionStorage.saveToLocalStorage('languageData', currectLang);
        this.translate.setDefaultLang('en');
      }
    }
    else{
      this.translate.use(data.language_code);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    const userData = this.sessionStorage.getFromSession('userInfo');
    if (userData) {
      window.localStorage['timestamp'] = new Date().getTime();
    }
  }

}
