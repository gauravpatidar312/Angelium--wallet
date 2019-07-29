import { Component, OnInit } from '@angular/core';

declare let jQuery: any;
declare const TradingView: any;

@Component({
  selector: 'ngx-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('ul.mytradeLine li a').click(function (e) {
      jQuery('ul.mytradeLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
    new TradingView.widget(
      {
        "width": 800,
        "height": 500,
        "symbol": "BITFINEX:XRPUSD",
        "timezone": "Etc/UTC",
        "theme": "Dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "withdateranges": true,
        "range": "5d",
        "allow_symbol_change": true,
        "container_id": "tradingview_58f3c"
      }
    );
  }
}
