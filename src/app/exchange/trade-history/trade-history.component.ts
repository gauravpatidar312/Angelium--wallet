import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { HttpService } from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
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
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private translate: TranslateService,) {}

  ngOnInit() {
    this.shareDataService.currentPair.subscribe((val?:any)=> {
      
    });
  }
  
  parentData(data: any){
    if (data) {  
      this.tradeHistorySpinner = true;
      this.noHistory = false;
      this.getTradeHistory(data);
    }
  }

  getTradeHistory(data: any){
    let pairData = { 'pair': data.pair };
    this.httpService.post(pairData, '/exchange/trades/').subscribe((res:any)=>{
      if(res.status){
        this.tradeHistorySpinner = false;
        this.noHistory = false;
        this.tradeData = res.data.trades;
        if (res.data.trades == 0) {
          this.tradeHistorySpinner = false;
          this.noHistory = true;
        }
      }
    }, err=>{
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), 
          this.translate.instant('pages.exchange.toastr.tradeHistoryError'));
    });
  }
}