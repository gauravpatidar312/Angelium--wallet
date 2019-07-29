import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ExChangeComponent } from './ex-change.component';
import { PairComponent } from './pair/pair.component';

const routes: Routes = [{
  path: '',
  component: ExChangeComponent,
  children: [{
    path: 'pair',
    component: PairComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExChangeRoutingModule {
}
