import {Component, AfterViewInit, OnInit} from '@angular/core';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class DashboardComponent implements OnInit, AfterViewInit {
 ngOnInit(){

 }


 ngAfterViewInit(){

 }
}
