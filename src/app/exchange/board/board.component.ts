import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {ShareDataService} from '../../services/share-data.service';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @ViewChild('sellData') private myScrollContainer: ElementRef;
  currentPair: any;
  boardSpinner: boolean = false;
  boardTableValue: boolean = false;
  boardBuy = [];
  boardSell = [];
  lastTrade: any = {};
  boardSellAvai: boolean = false;
  boardBuyAvai: boolean = false;
  orderBookData: any;
  lastTradeData: any;

  constructor(public shareDataService: ShareDataService,
              private httpService: HttpService,
              private toastrService: ToastrService,
              public translate: TranslateService) {}

  ngOnInit() {}

  getBoardData(pair: any) {
    const data = {
      'pair': pair,
      'timestamp': this.shareDataService.lastFetchDateTime
    };
    this.httpService.post(data, 'exchange/order_book/').subscribe((res?: any) => {
      this.boardSpinner = false;
      if (res.status) {
        if (!this.orderBookData)
          this.orderBookData = res.data;
        else {
          const orderBookData: any = _.merge(this.orderBookData, res.data);
          this.orderBookData.buy = _.unionBy(orderBookData.buy, '_id');
          this.orderBookData.sell = _.unionBy(orderBookData.sell, '_id');
          // Sell Array
          const sellData = _.chain(this.orderBookData.sell)
            .groupBy('price')
            .map((dataArray, key) => ({price: key, amount: _.sumBy(dataArray, 'amount')})).value();
          this.orderBookData.sell = _.orderBy(sellData, ['price'], ['asc']);
          // Buy Array
          const buyData = _.chain(this.orderBookData.buy)
            .groupBy('price')
            .map((dataArray, key) => ({price: key, amount: _.sumBy(dataArray, 'amount')})).value();
          this.orderBookData.buy = _.orderBy(buyData, ['price'], ['desc']);
        }

        this.boardTableValue = true;
        this.boardBuy = this.orderBookData.buy;
        this.boardSell = this.orderBookData.sell;
        this.boardSellAvai = !this.boardSell.length;
        this.boardBuyAvai = !this.boardBuy.length;

        setTimeout(() => {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 10);
      }
    }, (err) => {
      this.boardSpinner = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err),  this.translate.instant('pages.exchange.toastr.board'));
    });
  }

  parentData(data: any) {
    if (this.shareDataService.showSpinnerForExchange) {
      this.lastTradeData = {};
      this.orderBookData = {};
    }
    if (data) {
      this.boardSpinner = true;
      this.boardTableValue = false;
      this.currentPair = data;
      this.getBoardData(data.pair);
      this.getLastTrade(data.pair);
    }
  }

  getLastTrade(pair: any) {
    const data = {'pair': pair};
    this.httpService.post(data, 'exchange/lasttrade/').subscribe((res?: any) => {
      if (res.status) {
        if (!this.lastTradeData)
          this.lastTradeData = res.data;
        else
          this.lastTradeData = _.merge(this.lastTradeData, res.data);
        this.lastTrade = this.lastTradeData.last_trade;
      }
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.tradeHistory'));
    });
  }
}
