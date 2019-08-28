import {ApplicationRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {NavigationStart, NavigationEnd, Router} from '@angular/router';
import {HttpService} from './services/http.service';
import {SessionStorageService} from './services/session-storage.service';
import {AuthService} from './_guards/auth.service';
import {SwUpdate} from '@angular/service-worker';
import {concat, interval} from 'rxjs';
import {first} from 'rxjs/operators';
import {ShareDataService} from './services/share-data.service';
import {MessagingService} from './messaging.service';
import {ToastrService} from './services/toastr.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import Swal from 'sweetalert2';

declare let jQuery: any;
@Component({
  selector: 'ngx-app',
  template: '<particles [style]="particleStyle" [width]="particlewidth" [height]="particleheight" [params]="particleParams"></particles><router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  particleStyle: object = {};
  particleParams: object = {};
  particlewidth: number = 100;
  particleheight: number = 100;
  message: string;
  deviceInfo: any;

  constructor(private appRef: ApplicationRef,
              private analytics: AnalyticsService,
              private httpService: HttpService,
              private router: Router,
              private swUpdate: SwUpdate,
              public translate: TranslateService,
              private sessionStorage: SessionStorageService,
              private shareDataService: ShareDataService,
              private authService: AuthService,
              private msgService: MessagingService,
              private toastrService: ToastrService,
              private deviceService: DeviceDetectorService) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (this.deviceInfo.browser === 'IE') {
      this.switchBrowser();
    }
    router.events.subscribe((event?: any) => {
      if (event instanceof NavigationStart) {
        // Added to check new update on every route.
        if (this.swUpdate.isEnabled) {
          this.swUpdate.checkForUpdate();
        }
        if (event.url === '/' || event.url === '/login') {
          this.shareDataService.autoLogOut = true;
        }
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
    this.msgService.getPermission();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;

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
        this.shareDataService.newVersion = true;
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

    this.particleStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'background-image': 'url("../assets/images/theme-bg.jpg")',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-position': '50% 50%',
    };

    this.particleParams = {
      'particles': {
        'number': {
          'value': 55,
        },
        'color': {
          'value': '#ffffff',
        },
        'opacity': {
          'value': 1,
          'random': false,
        },
        'size': {
          'value': 3,
          'random': true,
        },
        'line_linked': {
          'enable': true,
          'distance': 150,
          'color': '#ffffff',
          'opacity': 0.9,
          'width': 1,
        },
        'move': {
          'enable': true,
          'speed': 3,
          'direction': 'none',
          'random': false,
          'straight': false,
          'out_mode': 'bounce',
        },
      },
      'retina_detect': true,
    };
  }

  switchBrowser() {
    Swal.fire({
      title: this.translate.instant('common.angelium'),
      text: this.translate.instant('common.toastr.IEBrowserMessage'),
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: this.translate.instant('swal.ok'),
    }).then(() => {
      window.close();
    });
  }

  setPageClass() {
    if (this.router.url && this.router.url !== '/') {
      const url = this.router.url.replace(/^\/+|\/+$/g, '');
      const bodyTag = jQuery('body');
      if (url) {
        bodyTag.removeClass(function (index, css) {
          return (css.match(/(^|\s)pages-\S+/g) || []).join(' ');
        });
        bodyTag.removeClass(function (index, css) {
          return (css.match(/(^|\s)games-\S+/g) || []).join(' ');
        });
        bodyTag.removeClass(function (index, css) {
          return (css.match(/(^|\s)exchange \S+/g) || []).join(' ');
        });
        bodyTag.addClass(url.replace(/[\/ ]/g, '-'));
      }
    }
  }

  setLanguage(data: any) {
    if (!data) {
      const languages = [
        {'id': 1, 'language': 'English', 'language_code': 'en'},
        {'id': 2, 'language': 'Chinese', 'language_code': 'zh'},
        {'id': 3, 'language': 'Korean', 'language_code': 'ko'}
      ];
      const browserDetectLang = navigator.language.split('-')[0];
      const currectLang = languages.find((data: any) => {
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

  @HostListener('window:popstate', ['$event'])
  public popstate($event) {
    const data = $event.currentTarget.location;
    const rememberUser = this.sessionStorage.getFromLocalStorage('rememberMe');
    const userData = this.sessionStorage.getFromSession('userInfo');
    if (data.hash === '#/login') {
      if (rememberUser && !userData.is_2fa_enable)
        history.go(1);
      else if (userData) {
        setTimeout(() => {
          this.toastrService.info(this.translate.instant('common.toastr.logOut'), this.translate.instant('common.angelium'));
        }, 10);
        this.authService.logout();
      }
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
