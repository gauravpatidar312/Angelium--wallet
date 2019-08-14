import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';
import {TradeComponent} from '../trade/trade.component';
import {BoardComponent} from '../board/board.component';
import {TradeHistoryComponent} from '../trade-history/trade-history.component';

import * as _ from 'lodash';
declare let jQuery: any;
declare const TradingView: any;

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  myTradeHistory: any = [];
  openOrderBuySell: any = [];
  tradeTab1: boolean = false;
  tradeTab2: boolean = false;
  fetchTradeData: boolean = false;
  noDataOpenTrade: boolean = false;
  noDataTradeHistory: boolean = false;
  currentPair: any;

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {}

  @ViewChild(TradeComponent) private tradeComponent: TradeComponent;
  @ViewChild(BoardComponent) private boardComponent: BoardComponent;
  @ViewChild(TradeHistoryComponent) private tradeHistoryComponent: TradeHistoryComponent;

  ngOnInit() {}

  ngAfterViewInit() {
    jQuery('ul.mytradeLine li a').click(function (e) {
      jQuery('ul.mytradeLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }

  getOpenOrder(pair: any) {
    const data = {'pair': pair};
    this.tradeTab1 = false;
    this.tradeTab2 = false;
    this.fetchTradeData = true;
    this.noDataOpenTrade = false;
    this.noDataTradeHistory = false;
    this.httpService.post(data, 'exchange/order_open/').subscribe((res?: any) => {
      this.fetchTradeData = false;
      if (res.status) {
        this.tradeTab1 = true;
        this.openOrderBuySell = _.concat(res.data.buy, res.data.sell);
        if (!res.data || !(res.data.buy.length && res.data.sell.length))
          this.noDataOpenTrade = false;
        else
        this.noDataOpenTrade = true;
      }
    }, (err) => {
      this.fetchTradeData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myOpenTradeError'));
    });
  }

  getMyTradeHistory(pair: any) {
    const data = {'pair': pair};
    this.tradeTab1 = false;
    this.tradeTab2 = false;
    this.fetchTradeData = true;
    this.noDataOpenTrade = false;
    this.noDataTradeHistory = false;
    this.httpService.post(data, 'exchange/mytrades/').subscribe((res?: any) => {
      this.fetchTradeData = false;
      if (res.status) {
        this.tradeTab2 = true;
        this.myTradeHistory = res.data;
        if (this.myTradeHistory.length === 0)
          this.noDataTradeHistory = true;
        else
          this.noDataTradeHistory = false;
      }
    }, (err) => {
      this.fetchTradeData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myOpenTradeError'));
    });
  }

  receiveMessage($event) {
    if ($event.from === 'anx') {
      jQuery('.tradingview-widget-container').css('display', 'none');
      jQuery('.trade-chart-anx').css('display', 'block');
    } else {
      jQuery('.trade-chart-anx').css('display', 'none');
      jQuery('.tradingview-widget-container').css('display', 'block');
    }
    new TradingView.widget($event);
    if ($event) {
      this.currentPair = $event;
      this.getOpenOrder($event.pair);
      this.getTradeChartData($event.pair);
      this.tradeComponent.parentData($event);
      this.boardComponent.parentData($event);
      this.tradeHistoryComponent.parentData($event);
    }
  }

  tradeChartData: any;

  getTradeChartData(pair: any) {
    const data = {'pair': pair};
    this.httpService.post(data, 'exchange/chartdata/').subscribe((res?: any) => {
      this.tradeChartData = res.data.chart;
    });
  }
}
