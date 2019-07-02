import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { UserData } from '../../../@core/data/users';
import { AnalyticsService } from '../../../@core/utils';
import { LayoutService } from '../../../@core/utils';
import { HttpService } from "../../../services/http.service";
import { ShareDataService } from "../../../services/share-data.service";
import { AuthService } from '../../../_guards/auth.service';
import { SessionStorageService } from "../../../services/session-storage.service";
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

declare let $: any;

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isProduction: any = environment.production;
  userData: any;
  @Input() position = 'normal';

  user: any;

  userMenu = [
    {  title: this.translate.instant('common.profile'), link: '/pages/setting' },
    { title: this.translate.instant('header.logout') }
  ];

  totalAnxLiveValue = 0;
  anxValue;
  myEarning;
  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserData,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private nbMenuService: NbMenuService,
    private authService: AuthService,
    private httpService: HttpService,
    private shareDataService: ShareDataService,
    private sessionStorage: SessionStorageService,
    private router: Router,
    public translate: TranslateService,) {
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.userMenu = [
        { title: this.translate.instant('common.profile'), link: '/pages/setting' },
        { title: this.translate.instant('header.logout') }
      ];
    });
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => {
        this.user = users.nick;
      });

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title === this.translate.instant('header.logout')) {
          this.authService.logout();
        }
      });

    this.userData = this.sessionStorage.getFromSession('userInfo');

    this.shareDataService.currentData.subscribe(data => {
      if (data.avatar) {
        this.userData.avatar = data.avatar;
      }
    });
    this.getANXValue();
    this.getMyEarning();
    this.getTotalAssetsValue();
  }

  ngAfterViewInit() {
    $('.notificationCalender').click(() => {
      let el = $('#notifyCalender');
      if (el.length > 0) {
        el[0].scrollIntoView();
      } else {
        this.shareDataService.showNotification = true;
        this.router.navigate(['pages/dashboard']);
      }
    });

    $('.layout-container div.content').click(() => {
      if ($(window).width() < 1200 && $('.menu-sidebar').length && $('.menu-sidebar').hasClass('expanded')) {
          this.toggleSidebar();
      }
    });
  }

  getANXValue() {
    this.httpService.get('anx-price/').subscribe((data?: any) => {
      this.anxValue = data.anx_price;
    });
  }

  getMyEarning() {
    this.httpService.get('my-earning/').subscribe((data?: any) => {
      this.myEarning = data.total;
    });
  }

  getTotalAssetsValue() {
    this.httpService.get('anx-live-price/').subscribe((data?: any) => {
      if (data) {
        if (data.hasOwnProperty('EOS')) {
          delete data.EOS;
        }
        if (data.hasOwnProperty('BTC')) {
          this.totalAnxLiveValue += data.BTC;
        }
        if (data.hasOwnProperty('ETH')) {
          this.totalAnxLiveValue += data.ETH;
        }
        if (data.hasOwnProperty('USDT')) {
          this.totalAnxLiveValue += data.USDT;
        }
      }
    });
  }

  toggleSidebar(): boolean {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
      return false;
    }

  goToHome() {
    this.router.navigate(['pages/dashboard']);
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
