import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';
import {TradeComponent} from '../trade/trade.component';
import {BoardComponent} from '../board/board.component';
import {TradeHistoryComponent} from '../trade-history/trade-history.component';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from 'moment';
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
  tradeChartData: any;
  openOrderData: any;
  viewOpenOrderData: boolean = false;
  viewTradeHistoryData: boolean = false;
  tradeHistoryData: any;

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              public shareDataService: ShareDataService,
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
    this.fetchTradeData = true;
    this.httpService.post(data, 'exchange/order_open/').subscribe((res?: any) => {
      this.fetchTradeData = false;
      if (res.status) {
        this.tradeTab1 = true;
        this.tradeTab2 = false;
        if (!this.openOrderData)
          this.openOrderData = res.data;
        else {
          this.openOrderData = _.merge(this.openOrderData, res.data);
          this.openOrderData.buy = _.unionBy(this.openOrderData.buy, '_id');
          this.openOrderData.sell = _.unionBy(this.openOrderData.sell, '_id');
        }
        this.openOrderBuySell = _.concat(this.openOrderData.buy, this.openOrderData.sell);
        if (!this.openOrderBuySell.length)
          this.noDataOpenTrade = true;
        else {
          this.viewOpenOrderData = true;
          this.noDataOpenTrade = false;
        }
      }
    }, (err) => {
      this.fetchTradeData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myOpenOrders'));
    });
  }

  onCancelOrder(orderId: string, pair: string) {
    Swal.fire({
      title: this.translate.instant('pages.exchange.orderCancel'),
      text: this.translate.instant('pages.exchange.orderCancelText'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('swal.yesSure'),
      cancelButtonText: this.translate.instant('swal.cancel')
    }).then((result) => {
      if (!result.value)
        return;

      const cancelData = {
        'order_id': orderId,
        'pair': pair
      };
      this.httpService.post(cancelData, 'exchange/order_cancel/').subscribe((res?: any) => {
        if (res.status)
          this.receiveMessage(this.shareDataService.currentPair);
        else {
          this.toastrService.danger(res.message, this.translate.instant('pages.exchange.toastr.myOpenOrders'));
        }
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myOpenOrders'));
      });
    });
  }

  getMyTradeHistory(pair: any) {
    const data = {'pair': pair};
    this.fetchTradeData = true;
    this.httpService.post(data, 'exchange/mytrades/').subscribe((res?: any) => {
      this.fetchTradeData = false;
      if (res.status) {
        this.tradeTab2 = true;
        this.tradeTab1 = false;
        if (!this.tradeHistoryData)
          this.tradeHistoryData = res.data;
        else
          this.tradeHistoryData = _.merge(this.tradeHistoryData, res.data);
        this.myTradeHistory = this.tradeHistoryData;
        this.noDataTradeHistory = !this.myTradeHistory.length;
        if (!this.noDataTradeHistory)
          this.viewTradeHistoryData = true;
      }
    }, (err) => {
      this.fetchTradeData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myTradeHistory'));
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
    if ($event) {
      if (!this.currentPair || this.currentPair.pair !== $event.pair) {
        this.shareDataService.hideSpinnerForExchange = true;
        new TradingView.widget($event);
        this.openOrderData = {};
        this.tradeHistoryData = [];
        this.viewOpenOrderData = false;
        this.viewTradeHistoryData = false;
        this.noDataTradeHistory = false;
        this.noDataOpenTrade = false;
      } else
        this.shareDataService.hideSpinnerForExchange = false;
      this.currentPair = $event;
      if (this.tradeTab2)
        this.getMyTradeHistory($event.pair);
      else
        this.getOpenOrder($event.pair);
      if ($event.from === 'anx' || $event.to === 'anx')
        this.getTradeChartData($event.pair);
      this.tradeComponent.parentData($event);
      this.boardComponent.parentData($event);
      this.tradeHistoryComponent.parentData($event);
      this.shareDataService.lastFetchDateTime = moment().valueOf();
    }
  }

  getTradeChartData(pair: any) {
    const data = {'pair': pair};
    this.httpService.post(data, 'exchange/chartdata/').subscribe((res?: any) => {
      this.tradeChartData = res.data.chart;
    });
  }
}
