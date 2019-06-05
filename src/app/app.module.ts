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
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { TermsConditionsComponent } from './register/terms-conditions/terms-conditions.component';
// services
import { SessionStorageService } from "./services/session-storage.service";
import { ToastrService } from "./services/toastr.service";
import { AuthService } from "./_guards/auth.service";
import { AuthGuard } from './_guards/auth.guard';
import { ShareDataService } from "./services/share-data.service";

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent, ResetPasswordComponent, TermsConditionsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule, InternationalPhoneNumberModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    SessionStorageService, ToastrService, AuthService,
    ShareDataService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  entryComponents: [TermsConditionsComponent]
})
export class AppModule {
}
