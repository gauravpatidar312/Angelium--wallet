import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import * as _ from 'lodash';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

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
    public translate: TranslateService) {
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setMenuTranslation();
    });
  }

  setMenuTranslation(){
    let menus = _.cloneDeep(MENU_ITEMS);
    let common = this.translate.instant('common');
    menus.forEach((item) => {
      if (item.title === 'Top') {
        item.title = common.top;
      }else if (item.title === 'Heaven') {
        item.title = common.heaven;
      }else if (item.title === 'Reward') {
        item.title = common.reward;
      }else if (item.title === 'Transfer') {
        item.title = common.transfer;
      }else if (item.title === 'Setting') {
        item.title = common.setting;
      }
      this.setVisibility(item);
    });
    this.menu = menus;
  }

  setVisibility(item) {
    if (!item.hidden && item.data && item.data.length)
      item.hidden = item.data.indexOf(this.userInfo.user_type) < 0;

    if (item.children && item.children.length) {
      item.children.forEach((child) => {
        this.setVisibility(child);
      });
    }
  }

  ngOnInit() {
    this.userInfo = this.sessionStorage.getFromSession('userInfo');
    this.setMenuTranslation();
  }
}
