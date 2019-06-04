import { AngelModule } from './angel/angel.module';
// import { HeavenModule } from './heaven/heaven.module';
import { HQModule } from './hq/hq.module';
import { NgModule } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SettingComponent } from './setting/setting.component';
import { TransferComponent } from './transfer/transfer.component';
import { KYCComponent } from './kyc/kyc.component';
import { HeavenComponent } from './heaven/heaven.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogNamePromptComponent } from './setting/dialog-prompt/dialog-prompt.component';
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
    ECommerceModule,
    MiscellaneousModule,
    AngelModule,
    Ng2SmartTableModule,
    // HeavenModule,
    ImageCropperModule,
    ThemeModule,
    HQModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    SettingComponent,
    TransferComponent,
    KYCComponent,
    HeavenComponent,
    DialogNamePromptComponent,
    MergeComponent,
  ],
  entryComponents: [
    DialogNamePromptComponent,
  ],
})
export class PagesModule {
}
