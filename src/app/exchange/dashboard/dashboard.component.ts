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
  tradeTabValue:boolean = false;
  noDataOpenTrade:boolean = false;
  noDataTradeHistory:boolean = false;
  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
    this.getOpenOrder();
  }

  
  ngOnInit() {}

  ngAfterViewInit() {
    jQuery('ul.mytradeLine li a').click(function (e) {
      jQuery('ul.mytradeLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }

  getOpenOrder(){
    let data = {'pair': 'ANX/BTC' };
    this.httpService.post(data, 'exchange/order_open/').subscribe((res?:any)=>{
      if (res.status) {
        this.tradeTabValue = false;
        this.tradeBuy = res.data.buy;
        this.tradeSell = res.data.sell;
        if (this.tradeBuy.length == 0 && this.tradeSell.length == 0) 
          this.noDataOpenTrade = true;
        else
          this.noDataOpenTrade = false; 
      }
    });
  }

  getMyTradeHistory(){
    let data = {'pair': 'ANX/BTC' };
    this.httpService.post(data, 'exchange/mytrades/').subscribe((res?:any)=>{
      if (res.status) {
        this.tradeTabValue = true;
        this.myTradeHistory = res.data;
        if (this.myTradeHistory.length == 0)  
          this.noDataTradeHistory = true;
        else 
          this.noDataTradeHistory = false; 
      }
    });
  }

  receiveMessage($event) {
    new TradingView.widget($event);
  }

}
