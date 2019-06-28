import { APP_BASE_HREF } from '@angular/common';
import { RewardModule } from './reward/reward.module';
// import { HeavenModule } from './heaven/heaven.module';
import { HQModule } from './hq/hq.module';
import { NgModule } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SettingComponent } from './setting/setting.component';
import { TransferComponent } from './transfer/transfer.component';
import { KYCComponent } from './kyc/kyc.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogNamePromptComponent } from './setting/dialog-prompt/dialog-prompt.component';
import { HeavenModule } from './heaven/heaven.module';
import { MergeComponent } from './merge/merge.component';
import { ImageCropperModule } from './setting/image-cropper/image-cropper.module';
import { NbDateFnsDateModule } from '@nebular/date-fns';
const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    RewardModule,
    Ng2SmartTableModule,
    // HeavenModule,
    ImageCropperModule,
    ThemeModule,
    HQModule,
    HeavenModule,
    NbDialogModule.forChild(),
    ClipboardModule,
    NgxQRCodeModule,
    NbDateFnsDateModule.forRoot({
      parseOptions: { awareOfUnicodeTokens: true },
      formatOptions: { awareOfUnicodeTokens: true },
    })
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    SettingComponent,
    TransferComponent,
    KYCComponent,
    DialogNamePromptComponent,
    MergeComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '#' },
  ],
  entryComponents: [
    DialogNamePromptComponent,
  ],
})
export class PagesModule {
}
