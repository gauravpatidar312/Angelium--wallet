import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'ngx-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss']
})
export class TradeHistoryComponent implements OnInit {
  tradeData:any = [];
  tradeHistorySpinner:boolean = false;
  constructor(private httpService:HttpService) { }

  ngOnInit() {
    let data = { 'pair': 'ANX/BTC' };
    this.tradeHistorySpinner = true;
    this.httpService.post(data, '/exchange/trades/').subscribe((res:any)=>{
      if(res.success){
        this.tradeHistorySpinner = false;
        this.tradeData = res.data.trades;
      }
    },err =>{ console.log(err) });
  }

}
