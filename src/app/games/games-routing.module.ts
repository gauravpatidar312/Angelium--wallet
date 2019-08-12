import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GamesComponent} from './games.component';
import {LotteryComponent} from './lottery/lottery.component';
import {BlackJackComponent} from './black-jack/black-jack.component';
import {AppConstants} from '../app.constants';
import {AuthGuard} from '../_guards/auth.guard';
import {BaccaratComponent} from './baccarat/baccarat.component';

const routes: Routes = [{
  path: '',
  component: GamesComponent,
  children: [
    {
      path: 'lottery',
      component: LotteryComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN]}
    },
    {
      path: 'black-jack',
      component: BlackJackComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN]}
    },
    {
      path: 'baccarat',
      component: BaccaratComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN]}
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GamesRoutingModule {
}
