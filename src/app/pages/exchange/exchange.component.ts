import { Component, OnInit } from '@angular/core';

declare let jQuery: any;

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
  }
}
