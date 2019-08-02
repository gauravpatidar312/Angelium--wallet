import { Component, OnInit } from '@angular/core';
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
              private shareDataService: ShareDataService,) {

  }
  tradeByu = {
    'ordertype': 'limit',
    'pair':'ANX/BTC',
    'from':'ANX',
    'to':'BTC',
    'amount': 0,
    'price': 0,
    'buy': true,
    'status': 1
  }
  tradeSell = {
    'ordertype': 'limit',
    'pair': 'ANX/BTC',
    'from': 'ANX',
    'to': 'BTC',
    'amount': 0,
    'price': 0,
    'buy': false,
    'status': 1
  }
  
  ngOnInit() {}


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
        this.toastrService.success('Trade buy', 'Trade buy successfully');
      }
    }, err=>{
      this.formSubmittingBuy = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'Trade buy error');
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
        this.toastrService.success('Trade sell', 'Trade sell successfully');
      }
    }, err=>{
      this.formSubmittingSell = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'Trade sell error');
    });
  }
}