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
  constructor(private shareDataService: ShareDataService,
              private httpService: HttpService) { }

  ngOnInit() {
    this.shareDataService.currentPair.subscribe((data?:any)=> {
      if (data) {
        this.boardSpinner = true;
        this.boardTableValue = false;
        this.currentPair = data;
        this.getBoardData(data.pair);
      }
    });
  }

  getBoardData(pair: any){
    let data = {'pair': pair };
    this.boardBuy = [];
    this.boardSell = [];  
    this.httpService.post(data, 'exchange/order_book/').subscribe((res?:any)=>{
      if (res.status) {
        this.boardSpinner = false;
        this.boardTableValue = true;
        this.boardBuy = res.data.buy;
        this.boardSell = res.data.sell;
      }
    });
  }
}