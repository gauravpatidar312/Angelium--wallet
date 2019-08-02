import { Component,ViewChild, OnInit } from '@angular/core';
import { PairComponent } from '../pair/pair.component';
declare let jQuery: any;
declare const TradingView: any;
@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
dataSet:string;
  constructor() { }
  
  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('ul.mytradeLine li a').click(function (e) {
      jQuery('ul.mytradeLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
    
    
  }


  receiveMessage($event) {
    new TradingView.widget($event);
  }

}
