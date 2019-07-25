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
import { CompanyComponent } from './company/company.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'setting',
      component: SettingComponent,
    },
    {
      path: 'transfer',
      component: TransferComponent,
    },
    {
      path: 'kyc',
      component: KYCComponent,
    },
    {
      path: 'heaven',
      component: HeavenComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'reward',
      component: RewardComponent,
    },
    {
      path: 'hq',
      component: HQComponent,
    },
    {
      path: 'company',
      component: CompanyComponent,
    },
    {
      path: 'admin',
      component: AdminComponent,
    },
    {
      path: 'merge',
      component: MergeComponent,
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
