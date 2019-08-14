import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {takeWhile} from 'rxjs/operators';
import {LiveUpdateChart, EarningData} from '../../../../@core/data/earning';
import {Router} from '@angular/router';
import {ShareDataService} from '../../../../services/share-data.service';
import {environment} from 'environments/environment';
import {HttpService} from '../../../../services/http.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'ngx-earning-card-front',
  styleUrls: ['./earning-card-front.component.scss'],
  templateUrl: './earning-card-front.component.html',
})
export class EarningCardFrontComponent implements OnDestroy, OnInit {
  private alive = true;
  @Input() currency: any;
  @Input() selectedCurrency: string = 'ANX';

  isProduction: any = environment.production;
  trafficChartPoints: number[];
  currencies: any = {
    'ANX': ['OTC'],
    'HEAVEN': ['HEAVEN'],
    'BTC': ['SEND', 'RECEIVE', 'HEAVEN'],
    'ETH': ['SEND', 'RECEIVE', 'HEAVEN'],
    'USDT': ['SEND', 'RECEIVE', 'HEAVEN'],
    'USDT (OMNI)': ['SEND', 'HEAVEN'],
    'USDT (ERC20)': ['RECEIVE', 'HEAVEN'],
  };
  tokenName: string;
  earningLiveUpdateCardData: LiveUpdateChart;
  liveUpdateChartData: { value: [string, number] }[];

  constructor(private earningService: EarningData,
              private shareDataService: ShareDataService,
              private router: Router,
              private httpService: HttpService) {
  }

  ngOnInit() {
    if (!(this.currency.order === 5 || this.currency.order === 6 || this.currency.order === 8 || this.currency.order === 9)) {
      this.httpService.get(`currency-statistic/?currency_type=${this.currency.name}`).subscribe((data?: any) => {
        this.liveUpdateChartData = _.map(data, (item) => {
          const itemArray: any = {};
          itemArray.type = this.currency.name;
          itemArray.value = [moment(item.created, 'YYYY-MM-DD').format('YYYY/MM/DD'), ShareDataService.toFixedDown(Number(item.live_price), 8)];
          return itemArray;
        });
      });
    }

    switch (this.selectedCurrency) {
      case 'ANX':
        this.tokenName = 'ANX';
        break;
      case 'HEAVEN':
        this.currency.quantity = null;
        this.tokenName = null;
        break;
      case 'ANL':
        this.tokenName = 'ANL';
        break;
      case 'ANLP':
        this.tokenName = 'ANL';
        break;
      default:
        this.tokenName = this.selectedCurrency;
        break;
    }

    if (this.currency.order === 5 || this.currency.order === 6 || this.currency.order === 8 || this.currency.order === 9) {
      this.getEarningCardData(this.currency.name);
    }
  }

  changeCurrency(currency, selectedCurrency) {
    if (currency === 'SEND' || currency === 'RECEIVE' || currency === 'OTC') {
      this.shareDataService.transferTab = currency;
      this.shareDataService.transferTitle = selectedCurrency;
      if(selectedCurrency == 'USDT (ERC20)'){
        this.shareDataService.transferTitle = 'ERCUSDT';
      }
      if(selectedCurrency == 'USDT (OMNY)'){
        this.shareDataService.transferTitle = 'USDT';
      }
      this.router.navigate(['/pages/transfer']);
    } else if (currency === 'HEAVEN') {
      if (selectedCurrency !== 'HEAVEN')
        this.shareDataService.transferTitle = selectedCurrency;
      this.router.navigate(['pages/heaven']);
    }
  }

  private getEarningCardData(currency) {
    this.earningService.getEarningCardData(currency)
      .pipe(takeWhile(() => this.alive))
      .subscribe((earningLiveUpdateCardData: LiveUpdateChart) => {
        this.earningLiveUpdateCardData = earningLiveUpdateCardData;
        this.liveUpdateChartData = earningLiveUpdateCardData.liveChart;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
