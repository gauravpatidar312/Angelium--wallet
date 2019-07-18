import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { RewardModule } from './reward/reward.module';
import { HQModule } from './hq/hq.module';
import { SettingComponent } from './setting/setting.component';
import { TransferComponent } from './transfer/transfer.component';
import { KYCComponent } from './kyc/kyc.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogNamePromptComponent } from './setting/dialog-prompt/dialog-prompt.component';
import { HeavenModule } from './heaven/heaven.module';
import { MergeComponent } from './merge/merge.component';
import { ImageCropperModule } from './setting/image-cropper/image-cropper.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    RewardModule,
    Ng2SmartTableModule,
    ImageCropperModule,
    ThemeModule,
    HQModule,
    HeavenModule,
    NbDialogModule.forChild(),
    ClipboardModule,
    NgxQRCodeModule,
    TranslateModule,
    InternationalPhoneNumberModule,
    NgSelectModule,
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
