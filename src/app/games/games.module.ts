import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../@theme/theme.module';
import { LotteryComponent } from './lottery/lottery.component';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { BlackJackComponent } from './black-jack/black-jack.component';

const GAMES_COMPONENTS = [
  GamesComponent,
];

@NgModule({
  imports: [
    GamesRoutingModule,
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
    ...GAMES_COMPONENTS,
    LotteryComponent,
    BlackJackComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '#' },
  ],
})
export class GamesModule { }
