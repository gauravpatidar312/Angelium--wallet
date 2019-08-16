import {Component, OnInit} from '@angular/core';
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
  currentPair: any;
  boardSpinner: boolean = false;
  boardTableValue: boolean = false;
  boardBuy = [];
  boardSell = [];
  lastTrade: any = {};
  noSellData: boolean = false;
  noBuyData: boolean = false;
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
        else
          this.orderBookData = _.merge(this.orderBookData, res.data);
        this.boardTableValue = true;
        this.boardBuy = this.orderBookData.buy;
        this.boardSell = this.orderBookData.sell;
        this.boardSellAvai = !this.boardSell.length;
        this.boardBuyAvai = !this.boardBuy.length;
      }
    }, (err) => {
      this.boardSpinner = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err),  this.translate.instant('pages.exchange.toastr.board'));
    });
  }

  parentData(data: any) {
    if (this.shareDataService.hideSpinnerForExchange) {
      this.lastTradeData = [];
      this.orderBookData = [];
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
