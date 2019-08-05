import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareDataService } from '../../services/share-data.service';

@Component({
  selector: 'ngx-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss']
})
export class TradeHistoryComponent implements OnInit {
  tradeData:any = [];
  tradeHistorySpinner:boolean = false;
  noHistory:boolean = false;
  
  constructor(private httpService:HttpService,
              private shareDataService: ShareDataService) {}

  ngOnInit() {
    this.shareDataService.currentPair.subscribe((val?:any)=> {
      if (val) {
        let data = { 'pair': val.pair };
        this.tradeHistorySpinner = true;
        this.tradeData = [];
        this.httpService.post(data, '/exchange/trades/').subscribe((res:any)=>{
          if(res.status){
            this.tradeHistorySpinner = false;
            this.tradeData = res.data.trades;
          }
          if(res.data.trades.length === 0){
            this.tradeHistorySpinner = false;
            this.noHistory = true;
          }
        },err =>{ console.log(err) });   
      }
    });
  }
}
