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
    jQuery('ul.tradeLine li a').click(function (e) {
      jQuery('ul.tradeLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }
}
