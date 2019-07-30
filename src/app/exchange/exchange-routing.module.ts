import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ExchangeComponent } from './exchange.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: ExchangeComponent,
  children: [{
    path: '',
    component: DashboardComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule {
}
