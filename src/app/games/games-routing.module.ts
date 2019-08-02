import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GamesComponent} from './games.component';
import {LotteryComponent} from './lottery/lottery.component';
import {BlackJackComponent} from './black-jack/black-jack.component';

const routes: Routes = [{
  path: '',
  component: GamesComponent,
  children: [
    {
      path: 'lottery',
      component: LotteryComponent,
    },
    {
      path: 'black-jack',
      component: BlackJackComponent,
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {
}
