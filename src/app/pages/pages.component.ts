import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';

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

  constructor(private sessionStorage: SessionStorageService) {
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

    MENU_ITEMS.forEach((item) => {
      this.setVisibility(item);
    });
    this.menu = MENU_ITEMS;
  }
}
