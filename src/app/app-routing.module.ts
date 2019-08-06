import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {RegisterComponent} from './register/register.component';
import {MaintenanceComponent} from './maintenance/maintenance.component';
import {ReportBugComponent} from './report-bug/report-bug.component';

const routes: Routes = [
  {path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule'},
  {path: 'exchange', loadChildren: 'app/exchange/exchange.module#ExchangeModule'},
  {path: 'games', loadChildren: 'app/games/games.module#GamesModule'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    redirectTo: 'register/',
  },
  {
    path: 'register/:invitation_code',
    component: RegisterComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  },
  {
    path: 'report',
    component: ReportBugComponent,
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login'},
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})

export class AppRoutingModule {
}
