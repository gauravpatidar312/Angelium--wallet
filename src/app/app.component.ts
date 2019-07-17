import {ApplicationRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {NavigationStart, NavigationEnd, Router} from '@angular/router';
import {HttpService} from './services/http.service';
import {SessionStorageService} from './services/session-storage.service';
import {IndexedDBStorageService} from './services/indexeddb-storage.service';
import {AuthService} from './_guards/auth.service';
import {SwUpdate} from '@angular/service-worker';
import {concat, interval} from 'rxjs';
import {first} from 'rxjs/operators';
declare let jQuery: any;
@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private appRef: ApplicationRef,
              private analytics: AnalyticsService,
              private httpService: HttpService,
              private router: Router,
              private swUpdate: SwUpdate,
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
      } else if (event instanceof NavigationEnd) {
        this.setPageClass();
      }
    });

    const lang = this.sessionStorage.getFromLocalStorage('languageData');
    this.setLanguage(lang);
    this.setPageClass();
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    if (this.swUpdate.isEnabled) {
      // Allow the app to stabilize first, before starting polling for updates with `interval()`.
      const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
      const everyTwoHours$ = interval(2 * 60 * 60 * 1000);
      const everyTwoHoursOnceAppIsStable$ = concat(appIsStable$, everyTwoHours$);
      everyTwoHoursOnceAppIsStable$.subscribe(() => this.swUpdate.checkForUpdate());

      // Checking for new update.
      this.swUpdate.available.subscribe((event) => {
        console.log('current version is ', event.current);
        console.log('available version is ', event.available);
        if (confirm('New version is available. Press OK to reload.')) {
          // Activate new update files and reload the page.
          this.swUpdate.activateUpdate()
            .then(() => {
              document.location.reload(true);
            });
        }
      });
      this.swUpdate.activated.subscribe(event => {
        // Just display new version log in console.
        console.log('old version was ', event.previous);
        console.log('new version is ', event.current);
      });
    }
  }

  setPageClass() {
    if(this.router.url && this.router.url !== '/') {
      let url = this.router.url.replace(/^\/+|\/+$/g, '');
      let menu = jQuery('.scrollable-container');
      if(url && menu) {
        menu.removeClass(function (index, css) {
          return (css.match(/(^|\s)pages-\S+/g) || []).join(' ');
        });
        menu.removeClass(function (index, css) {
          return (css.match(/(^|\s)games-\S+/g) || []).join(' ');
        });
        menu.addClass(url.replace(/[\/ ]/g, '-'));
      }
    }
  }

  setLanguage(data: any) {
    console.log(data);
    if (!data) {
      const languages = [
        { 'id': 1, 'language': 'English', 'language_code': 'en' },
        { 'id': 2, 'language': 'Chinese', 'language_code': 'zh' },
        { 'id': 3, 'language': 'Korean', 'language_code': 'ko' }
      ];
      const browserDetectLang = navigator.language.split('-')[0];
      const currectLang = languages.find((data:any)=> {
        return data.language_code === browserDetectLang;
      });
      if (currectLang) {
        this.translate.use(currectLang.language_code);
        this.sessionStorage.saveToLocalStorage('languageData', currectLang);
      } else {
        const language = {id: 1, language: 'English', language_code: 'en'};
        this.sessionStorage.saveToLocalStorage('languageData', language);
        this.translate.setDefaultLang('en');
      }
    } else {
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
