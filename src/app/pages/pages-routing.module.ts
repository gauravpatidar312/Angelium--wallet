import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingComponent} from './setting/setting.component';
import {TransferComponent} from './transfer/transfer.component';
import {KYCComponent} from './kyc/kyc.component';
import {HeavenComponent} from './heaven/heaven.component';
import {MergeComponent} from './merge/merge.component';
import {RewardComponent} from './reward/reward.component';
import {HQComponent} from './hq/hq.component';
import {CompanyComponent} from './company/company.component';
import {AdminComponent} from './admin/admin.component';
import {EventsListComponent} from './tickets/events-list/events-list.component';
import {EventsDetailComponent} from './tickets/events-detail/events-detail.component';

import {AppConstants} from '../app.constants';
import {AuthGuard} from '../_guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'setting',
      component: SettingComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'transfer',
      component: TransferComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'kyc',
      component: KYCComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'heaven',
      component: HeavenComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'reward',
      component: RewardComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'merge',
      component: MergeComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'company',
      component: CompanyComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN]},
    },
    {
      path: 'hq',
      component: HQComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.ADMIN]},
    },
    {
      path: 'admin',
      component: AdminComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.ADMIN]},
    },
    {
      path: 'xticket',
      component: EventsListComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.ADMIN]},
    },
    {
      path: 'xticket/:id',
      component: EventsDetailComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.ADMIN]},
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      redirectTo: 'dashboard',
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PagesRoutingModule {
}
