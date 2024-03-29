import {Component, OnDestroy} from '@angular/core';
import {delay, withLatestFrom, takeWhile} from 'rxjs/operators';
import {
  NbMediaBreakpoint, NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService
} from '@nebular/theme';

import {StateService} from '../../../@core/utils';
import {SessionStorageService} from '../../../services/session-storage.service';
import {Router} from '@angular/router';

declare let jQuery: any;

// TODO: move layouts into the framework
@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>
      <nb-layout-header fixed>
        <ngx-header [position]="sidebar.id === 'start' ? 'normal': 'inverse'"></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive [end]="sidebar.id === 'end'">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-column start class="small" *ngIf="layout.id === 'two-column' || layout.id === 'three-column'">
        <nb-menu [items]="subMenu"></nb-menu>
      </nb-layout-column>

      <nb-layout-column class="small" *ngIf="layout.id === 'three-column'">
        <nb-menu [items]="subMenu"></nb-menu>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>

      <nb-layout-footer class="bottom-menu" *ngIf="(userInfo?.user_type === 'owner' || userInfo?.user_type === 'company' || userInfo?.user_type === 'tester') && routerUrl != '/exchange'">
        <ul id="main-navigation"  class="nav navbar-pill headerLine">
          
          <li class="pointer" routerLinkActive="active" 
            [routerLinkActiveOptions]="{exact: true}"
          ><a data-toggle="pill" routerLink="/pages/dashboard">
             <i class="fa fa-wallet" style="float:none"></i> {{"common.wallet" | translate}}</a>
          </li>

          <li class="pointer" routerLinkActive="active" 
            [routerLinkActiveOptions]="{exact: true}">
            <a data-toggle="pill" routerLink="/exchange">
              <i class="iconsize nb-shuffle" style="float:none"></i>
              <span class="exchange-position">{{"common.exchange" | translate}}</span>
            </a>
          </li>
        </ul>
      </nb-layout-footer>
      

    </nb-layout>
  `,
})

export class SampleLayoutComponent implements OnDestroy {
  subMenu: NbMenuItem[] = [
    {
      title: 'PAGE LEVEL MENU',
      group: true,
    },
    {
      title: 'Buttons',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/buttons',
    },
    {
      title: 'Grid',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/grid',
    },
    {
      title: 'Icons',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/icons',
    },
    {
      title: 'Modals',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/modals',
    },
    {
      title: 'Typography',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/typography',
    },
    {
      title: 'Animated Searches',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/search-fields',
    },
    {
      title: 'Tabs',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/tabs',
    },
  ];
  layout: any = {};
  sidebar: any = {};
  userInfo: any;
  routerUrl: any;

  private alive = true;

  constructor(protected stateService: StateService,
              protected menuService: NbMenuService,
              protected themeService: NbThemeService,
              protected bpService: NbMediaBreakpointsService,
              private sessionStorage: SessionStorageService,
              protected sidebarService: NbSidebarService,
              private router: Router) {
    this.stateService.onLayoutState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((layout: string) => this.layout = layout);

    this.stateService.onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName('is');
    this.menuService.onItemSelect()
      .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
      )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {
        if (bpTo.width <= isBp.width) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });
    this.userInfo = this.sessionStorage.getFromSession('userInfo');
    this.routerUrl = router.url;
  }

  ngAfterViewInit(){
    var value = 0;

    jQuery('.bottom-menu').fadeOut();
    jQuery.fn.scrollEnd = function(callback, timeout) {


      jQuery('.scrollable-container').scroll(function(){
        var $this = jQuery(this);
        var width = $this.width();
        var scrollPos = $this.scrollTop();

        if (scrollPos > value && width < 900) { // scroll down
            jQuery('.bottom-menu').fadeIn();
        }
        value = scrollPos;

        if ($this.data('scrollTimeout')) {
          clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, timeout));
      });
    };

    jQuery(window).scrollEnd(function(){
      jQuery('.bottom-menu').fadeOut();
    }, 10000);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
