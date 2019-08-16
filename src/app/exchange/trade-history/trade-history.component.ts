import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss']
})
export class TradeHistoryComponent implements OnInit {
  tradeData: any = [];
  tradeHistorySpinner: boolean = false;
  noHistory: boolean = false;
  tradeHistoryData: any;
  viewTradeHistory: boolean = false;

  constructor(private httpService: HttpService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {}

  parentData(data: any) {
    if (this.shareDataService.hideSpinnerForExchange)
      this.tradeHistoryData = [];
    if (data) {
      this.tradeHistorySpinner = true;
      this.viewTradeHistory = false;
      this.getTradeHistory(data);
    }
  }

  getTradeHistory(data: any) {
    const pairData = {
      'pair': data.pair,
      'timestamp': this.shareDataService.lastFetchDateTime
    };
    this.httpService.post(pairData, 'exchange/trades/').subscribe((res: any) => {
      this.tradeHistorySpinner = false;
      if (res.status) {
        if (!this.tradeHistoryData)
          this.tradeHistoryData = res.data;
        else
          this.tradeHistoryData = _.merge(this.tradeHistoryData, res.data);
        this.viewTradeHistory = true;
        this.tradeData = this.tradeHistoryData.trades;
        this.noHistory = !this.tradeData.length;
      }
    }, err => {
      this.tradeHistorySpinner = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err),
        this.translate.instant('pages.exchange.toastr.tradeHistoryError'));
    });
  }
}
