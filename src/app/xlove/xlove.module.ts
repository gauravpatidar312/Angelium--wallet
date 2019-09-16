import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../@theme/theme.module';
import { XloveRoutingModule } from './xlove-routing.module';
import { XloveComponent } from './xlove.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const ExChange_COMPONENTS = [
  XloveComponent,
];

@NgModule({
  imports: [
    XloveRoutingModule,
    // ThemeModule,
    // Ng2SmartTableModule,
    // ThemeModule,
    // NbDialogModule.forChild(),
    // ClipboardModule,
    // NgxQRCodeModule,
    // TranslateModule,
    // NgSelectModule,
    // NgxEchartsModule
  ],
  declarations: [
    ...ExChange_COMPONENTS,
    DashboardComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '#' },
  ],
})
export class XloveModule { }
