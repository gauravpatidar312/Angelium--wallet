import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GamesComponent} from './games.component';
import {LotteryComponent} from './lottery/lottery.component';

const routes: Routes = [{
  path: '',
  component: GamesComponent,
  children: [{
    path: 'lottery',
    component: LotteryComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {
}
