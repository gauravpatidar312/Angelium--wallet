import { Component, OnInit } from '@angular/core';
declare let jQuery: any;

@Component({
  selector: 'ngx-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  
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
}
