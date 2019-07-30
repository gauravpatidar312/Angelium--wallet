import {APP_BASE_HREF, DecimalPipe} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {CoreModule} from './@core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InternationalPhoneNumberModule} from 'ngx-international-phone-number';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ThemeModule} from './@theme/theme.module';
import {LoginComponent} from './login/login.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {RegisterComponent} from './register/register.component';
import {TermsConditionsComponent} from './register/terms-conditions/terms-conditions.component';
import { ParticlesModule } from 'angular-particle';

// services
import {SessionStorageService} from './services/session-storage.service';
import {ToastrService} from './services/toastr.service';
import {AuthService} from './_guards/auth.service';
import {ShareDataService} from './services/share-data.service';
import {MaintenanceComponent} from './maintenance/maintenance.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import {reducers, AppState} from './@core/store/app.state';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './@core/store/effects/auth.effect';
import {StoreModule, Store} from '@ngrx/store';
import {IndexedDBStorageService} from './services/indexeddb-storage.service';
import {UserInfo} from './@core/store/actions/user.action';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import { ReportBugComponent } from './report-bug/report-bug.component';
import {GamesModule} from './games/games.module';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ExChangeModule } from './ex-change/ex-change.module';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent, ChangePasswordComponent, ForgetPasswordComponent, ResetPasswordComponent, TermsConditionsComponent, MaintenanceComponent, ReportBugComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule, InternationalPhoneNumberModule, ParticlesModule,
    ExChangeModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([AuthEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    GamesModule
  ],
  bootstrap: [AppComponent],
  providers: [
    SessionStorageService, ToastrService, AuthService, DecimalPipe,
    ShareDataService,
    {provide: APP_BASE_HREF, useValue: '/'},
    IndexedDBStorageService
  ],
  entryComponents: [TermsConditionsComponent]
})
export class AppModule {
  constructor(private store: Store<AppState>,
              private sessionStorage: SessionStorageService,
              private shareDataService: ShareDataService,
              private storageService: IndexedDBStorageService) {
    this.checkSession();
  }

  async checkSession() {
    const data: any = await this.storageService.getSessionStorage();
    if (data) {
      // Check if user is already logged in on page refresh
      if (this.sessionStorage.getSessionStorage('loggedIn')) {
        // Check user it at login screen then auto logout user.
        if (this.shareDataService.autoLogOut) {
          this.storageService.resetStorage();
          this.shareDataService.autoLogOut = false;
        } else
          this.store.dispatch(new UserInfo(data));
      } else if (window.localStorage.timestamp) { // Check if new tab is open by logged in user or new session
        let t0 = Number(window.localStorage['timestamp']);
        if (isNaN(t0)) t0 = 0;
        const t1 = new Date().getTime();
        const duration = t1 - t0;
        if (duration < 20 * 1000) {
          this.sessionStorage.saveToSession('loggedIn', true);
          this.store.dispatch(new UserInfo(data));
        } else {
          const rememberUser = this.sessionStorage.getFromLocalStorage('rememberMe');
          if (rememberUser && !data.is_2fa_enable) {
            this.sessionStorage.saveToSession('loggedIn', true);
            this.store.dispatch(new UserInfo(data));
          } else {
            // This means user has closed the tab and opened again so logged user out.
            console.warn('DB cleared for logout on tab close');
            this.storageService.resetStorage();
          }
        }
      } else {
        // This means user is logged in and open new tab
        this.store.dispatch(new UserInfo(data));
      }
      delete window.localStorage.timestamp;
    }
  }
}
