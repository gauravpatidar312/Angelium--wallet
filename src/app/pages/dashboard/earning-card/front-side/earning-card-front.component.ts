import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {switchMap, takeWhile} from 'rxjs/operators';
import {LiveUpdateChart, EarningData} from '../../../../@core/data/earning';
import {Router} from '@angular/router';
import {ShareDataService} from '../../../../services/share-data.service';
import {environment} from 'environments/environment';
import {HttpService} from '../../../../services/http.service';
import * as _ from 'lodash';

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
  intervalSubscription: Subscription;
  currencyType: any = {
    'ANX': ['OTC'],
    'HEAVEN': ['HEAVEN'],
    'BTC': ['SEND'],
    'ETH': ['SEND'],
    'USDT': ['SEND'],
  };
  currencies: any = {
    'ANX': ['OTC'],
    'HEAVEN': ['HEAVEN'],
    'BTC': ['SEND', 'RECEIVE', 'HEAVEN'],
    'ETH': ['SEND', 'RECEIVE', 'HEAVEN'],
    'USDT': ['SEND', 'RECEIVE', 'HEAVEN'],
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
        const priceData = _.map(data, 'live_price');
        this.trafficChartPoints = this.currency.order === 3 ? priceData.map(item => ShareDataService.toFixedDown(Number(item), 0)) : priceData.map(item => ShareDataService.toFixedDown(Number(item), 2));
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

        this.startReceivingLiveData(currency);
      });
  }

  startReceivingLiveData(currency) {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(200)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.earningService.getEarningLiveUpdateCardData(currency)),
      )
      .subscribe((liveUpdateChartData: any[]) => {
        this.liveUpdateChartData = [...liveUpdateChartData];
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
