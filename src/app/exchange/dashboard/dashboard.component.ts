import { Component,ViewChild, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  myTradeHistory:any = [];
  openOrderBuySell:any = [];
  tradeTab1:boolean = false;
  tradeTab2:boolean = false;
  fatchTradeData:boolean = false;
  noDataOpenTrade:boolean = false;
  noDataTradeHistory:boolean = false;
  currentPair:any;
  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {

  }

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

  getOpenOrder(pair: any){
    let data = {'pair': pair };
    this.tradeTab1 = false;
    this.tradeTab2 = false;
    this.fatchTradeData = true;
    this.noDataOpenTrade = false;
    this.noDataTradeHistory = false;
    this.httpService.post(data, 'exchange/order_open/').subscribe((res?:any)=>{
      if (res.status) {
        this.fatchTradeData = false;
        this.tradeTab1 = true;
        this.openOrderBuySell = _.concat(res.data.buy, res.data.sell);
        if (res.data.buy == 0 && res.data.sell == 0) 
          this.noDataOpenTrade = true;
        else
          this.noDataOpenTrade = false; 
      }
    }, (err)=>{ 
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myOpenTradeError'));
    });
  }

  getMyTradeHistory(pair: any){
    let data = {'pair': pair };
    this.tradeTab1 = false;
    this.tradeTab2 = false;
    this.fatchTradeData = true;
    this.noDataOpenTrade = false;
    this.noDataTradeHistory = false;
    this.httpService.post(data, 'exchange/mytrades/').subscribe((res?:any)=>{
      if (res.status) {
        this.fatchTradeData = false;
        this.tradeTab2 = true;
        this.myTradeHistory = res.data;
        if (this.myTradeHistory.length == 0)  
          this.noDataTradeHistory = true;
        else 
          this.noDataTradeHistory = false;
      }
    }, (err)=>{
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.myOpenTradeError'));
    });
  }

  receiveMessage($event) {
    new TradingView.widget($event);
    if ($event) {
      this.currentPair = $event;
      this.getOpenOrder($event.pair);
      this.tradeComponent.parentData($event);
      this.boardComponent.parentData($event);
      this.tradeHistoryComponent.parentData($event);
    }
  }
}