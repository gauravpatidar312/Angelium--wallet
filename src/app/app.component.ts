/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { TranslateService } from "@ngx-translate/core";
import { SessionStorageService } from "./services/session-storage.service";

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService,
    public sessionStorageService: SessionStorageService,
    public translate: TranslateService) {
      this.translate.setDefaultLang("en");
      this.setLanguage();
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }

  setLanguage() {
    const userInfo = this.sessionStorageService.getFromSession("userInfo");
    let selectedLanguage =
      userInfo == false ? userInfo.language : 'en';
    this.translate.use(selectedLanguage);
  }
}
