import { Component, OnInit } from '@angular/core';
import {ShareDataService} from '../../services/share-data.service';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'ngx-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  currentPair:any;
  boardSpinner:boolean = false;
  boardTableValue:boolean = false;
  boardBuy = [];
  boardSell = [];
  noSellData:boolean = false;
  noBuyData:boolean = false;
  boardSellAvai: boolean = false;
  boardBuyAvai: boolean = false;
  constructor(private shareDataService: ShareDataService,
              private httpService: HttpService) { }

  ngOnInit() {}

  getBoardData(pair: any){
    let data = {'pair': pair };
    this.httpService.post(data, 'exchange/order_book/').subscribe((res?:any)=>{
      if (res.status) {
        this.boardSpinner = false;
        this.boardTableValue = true;
        this.boardBuy = res.data.buy;
        this.boardSell = res.data.sell;
        if (res.data.sell!=0)  this.boardSellAvai = false;
        else this.boardSellAvai = true;
        if (res.data.buy!=0)  this.boardBuyAvai = false;
        else this.boardBuyAvai = true;
      }
    });
  }

  parentData(data: any){
    if (data) {
      this.boardSpinner = true;
      this.boardTableValue = false;
      this.currentPair = data;
      this.getBoardData(data.pair);
      this.getLastTrade(data.pair);
    }
  }

  lastTrade:any = {};
  getLastTrade(pair: any){
    let data = {'pair': pair };
    this.httpService.post(data, 'exchange/lasttrade/').subscribe((res?:any)=>{
      if (res.status) {
        this.lastTrade = res.data.last_trade;
      }
    });
  }
}