import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GamesComponent} from './games.component';
import {LotteryComponent} from './lottery/lottery.component';
import {BlackJackComponent} from './black-jack/black-jack.component';
import {AppConstants} from '../app.constants';
import {AuthGuard} from '../_guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: GamesComponent,
  children: [
    {
      path: 'lottery',
      component: LotteryComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.ADMIN]}
    },
    {
      path: 'black-jack',
      component: BlackJackComponent,
      canActivate: [AuthGuard],
      data: {role: [AppConstants.ROLES.ADMIN]}
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GamesRoutingModule {
}
