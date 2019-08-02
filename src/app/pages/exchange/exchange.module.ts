import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { ExchangeComponent } from './exchange.component';
import { PairComponent } from './pair/pair.component';
import { TradeComponent } from './trade/trade.component';
import { BoardComponent } from './board/board.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';

@NgModule({
  declarations: [
    ExchangeComponent,
    PairComponent,
    TradeComponent,
    BoardComponent,
    TradeHistoryComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule
  ]
})
export class ExchangeModule { }
