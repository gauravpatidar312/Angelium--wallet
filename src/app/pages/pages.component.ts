import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { ShareDataService } from '../services/share-data.service';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu: any;
  userInfo: any;

  constructor(private sessionStorage: SessionStorageService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setMenuTranslation();
    });
  }

  setMenuTranslation() {
    const menus = MENU_ITEMS;
    menus.forEach((item) => {
      this.setVisibility(item);
    });
    this.menu = menus;
  }

  setVisibility(item) {
    delete item.hidden;
    if (!item.hidden && item.data && item.data.length)
      item.hidden = item.data.indexOf(this.userInfo.user_type) < 0;
    if (item.children && item.children.length) {
      item.children.forEach((child) => {
        this.setVisibility(child);
      });
    }
    item.title = this.translate.instant('common.'+item.languageKey);
  }

  ngOnInit() {
    this.userInfo = this.sessionStorage.getFromSession('userInfo');
    this.setMenuTranslation();
    this.shareDataService.currentData.subscribe(data => {
      if (data) {
        this.userInfo = data;
        this.setMenuTranslation();
      }
    });
  }
}
