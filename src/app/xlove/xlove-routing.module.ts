import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppConstants} from '../app.constants';
import {AuthGuard} from '../_guards/auth.guard';
import { XloveComponent } from './xlove.component';

const routes: Routes = [{
  path: '',
  component: XloveComponent,
  children: [{
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {role: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN, AppConstants.ROLES.TESTER]}
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class XloveRoutingModule {
}
