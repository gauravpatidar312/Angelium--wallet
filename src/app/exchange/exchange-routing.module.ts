import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ExchangeComponent} from './exchange.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppConstants} from '../app.constants';
import {AuthGuard} from '../_guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: ExchangeComponent,
  children: [{
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {role: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN]}
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExchangeRoutingModule {
}
