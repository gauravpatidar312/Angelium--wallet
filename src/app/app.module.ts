/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { TermsConditionsComponent } from './register/terms-conditions/terms-conditions.component';
// services
import { SessionStorageService } from "./services/session-storage.service";
import { ToastrService } from "./services/toastr.service";
import { AuthService } from "./_guards/auth.service";
import { AuthGuard } from './_guards/auth.guard';
import { ShareDataService } from "./services/share-data.service";

import { reducers, AppState } from './@core/store/app.state';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './@core/store/effects/auth.effect';
import { StoreModule, Store } from '@ngrx/store';
import { IndexedDBStorageService } from "./services/indexeddb-storage.service";
import { UserInfo } from './@core/store/actions/user.action';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent, ChangePasswordComponent, ForgetPasswordComponent, ResetPasswordComponent, TermsConditionsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule, InternationalPhoneNumberModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([AuthEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [AppComponent],
  providers: [
    SessionStorageService, ToastrService, AuthService,
    ShareDataService,
    { provide: APP_BASE_HREF, useValue: '/' },
    IndexedDBStorageService
  ],
  entryComponents: [TermsConditionsComponent]
})
export class AppModule {

  constructor(private store: Store<AppState>,
    private storageService: IndexedDBStorageService) {
    this.storageService.getSessionStorage().subscribe((data) => {
      if (!data) {
      } else {
        this.store.dispatch(new UserInfo(data));
      }
    })
  }
}
