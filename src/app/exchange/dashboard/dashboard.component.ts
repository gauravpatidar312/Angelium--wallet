import { Component,ViewChild, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';

declare let jQuery: any;
declare const TradingView: any;

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tradeBuy = [];
  tradeSell = [];
  myTradeHistory = [];
  tradeTab1:boolean = false;
  tradeTab2:boolean = false;
  fatchTradeData:boolean = false;
  noDataOpenTrade:boolean = false;
  noDataTradeHistory:boolean = false;
  currentPair:any;
  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {}

  
  ngOnInit() {
    
    this.shareDataService.currentPair.subscribe((data?:any)=> {
      if (data) {
        this.currentPair = data;
        this.getOpenOrder(data.pair);
      }
    });
  }

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
        this.tradeBuy = res.data.buy;
        this.tradeSell = res.data.sell;
        if (this.tradeBuy.length == 0 && this.tradeSell.length == 0) 
          this.noDataOpenTrade = true;
        else
          this.noDataOpenTrade = false; 
      }
    }, (err)=>{ 
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'My open trade error');
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
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'My trade error');
    });
  }

  receiveMessage($event) {
    new TradingView.widget($event);
  }
}