import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../@theme/theme.module';
import { PairComponent } from './pair/pair.component';

import { ExChangeRoutingModule } from './ex-change-routing.module';
import { ExChangeComponent } from './ex-change.component';

const ExChange_COMPONENTS = [
  ExChangeComponent,
];

@NgModule({
  imports: [
ExChangeRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    ThemeModule,
    NbDialogModule.forChild(),
    ClipboardModule,
    NgxQRCodeModule,
    TranslateModule,
    NgSelectModule,
  ],
  declarations: [
    ...ExChange_COMPONENTS,
    PairComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '#' },
  ],
})
export class ExChangeModule { }
