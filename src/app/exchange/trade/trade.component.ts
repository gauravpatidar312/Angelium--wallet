import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';

declare let jQuery: any;

@Component({
  selector: 'ngx-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})

export class TradeComponent implements OnInit {
  formSubmittingSell:boolean = false;
  formSubmittingBuy:boolean = false;
  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService,) {

  }
  tradeByu = {
    'ordertype': 'limit',
    'pair':'anx/btc',
    'from':'anx',
    'to':'btc',
    'amount': 0,
    'price': 0,
    'buy': true,
    'status': 1
  }
  tradeSell = {
    'ordertype': 'limit',
    'pair': 'anx/btc',
    'from': 'anx',
    'to': 'btc',
    'amount': 0,
    'price': 0,
    'buy': false,
    'status': 1
  }
  
  ngOnInit() {
    this.shareDataService.currentPair.subscribe((data?:any)=> {
      if (data) {
        this.tradeByu.from = data.from;
        this.tradeByu.to = data.to;
        this.tradeByu.pair = data.pair;

        this.tradeSell.from = data.from;
        this.tradeSell.to = data.to;
        this.tradeSell.pair = data.pair;
      }
    });
  }

  ngAfterViewInit() {
    jQuery('ul.tabs li').click(function (e) {
      var tab_id = jQuery(this).attr('data-tab');
      jQuery('ul.tabs li').removeClass('active');
        jQuery('.tab-content').removeClass('active');
    
        jQuery(this).addClass('active');
        jQuery("#"+tab_id).addClass('active');
    });
  }

  submitTradeBuy(){
    if (this.tradeByu.price == 0 || this.tradeByu.amount == 0) return;
    this.formSubmittingBuy = true;
    this.httpService.post(this.tradeByu, 'exchange/order_add/').subscribe((res?:any)=>{
      this.formSubmittingBuy = false;
      if (res.status) {
        this.tradeByu.price = 0;
        this.tradeByu.amount = 0;
        this.toastrService.success(this.translate.instant('pages.exchange.tradeBuy'), this.translate.instant('pages.exchange.tradeBuySuccessfully'));
      }
    }, err=>{
      this.formSubmittingBuy = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.tradeBuyError'));
    });
  }

  submitTradeSell(){
    if (this.tradeSell.price == 0 || this.tradeSell.amount == 0) return;
    this.formSubmittingSell = true;
    this.httpService.post(this.tradeSell, 'exchange/order_add/').subscribe((res?:any)=>{
      this.formSubmittingSell = false;
      if (res.status) {
        this.tradeSell.price = 0;
        this.tradeSell.amount = 0;
        this.toastrService.success(this.translate.instant('pages.exchange.tradeSell'), this.translate.instant('pages.exchange.tradeSellSuccessfully'));
      }
    }, err=>{
      this.formSubmittingSell = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.tradeSellError'));
    });
  }
}