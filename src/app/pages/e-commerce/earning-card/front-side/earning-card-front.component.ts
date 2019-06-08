import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { LiveUpdateChart, EarningData } from '../../../../@core/data/earning';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-earning-card-front',
  styleUrls: ['./earning-card-front.component.scss'],
  templateUrl: './earning-card-front.component.html',
})
export class EarningCardFrontComponent implements OnDestroy, OnInit {
  private alive = true;

  @Input() selectedCurrency: string = 'ANX';
  @Input() amount: number = 0;
  @Input() quantity: number = 0;

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
  currentTheme: string;
  tokenName: string;
  earningLiveUpdateCardData: LiveUpdateChart;
  liveUpdateChartData: { value: [string, number] }[];

  constructor(private themeService: NbThemeService,
    private earningService: EarningData,
    private router: Router) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit() {
    switch (this.selectedCurrency) {
      case 'ANX':
      case 'HEAVEN':
        this.tokenName = 'ANX';
        break;
      case 'ANLP':
        this.tokenName = 'ANL';
        break;
      default:
        this.tokenName = this.selectedCurrency;
        break;
    }
    this.getEarningCardData(this.selectedCurrency);
  }

  changeCurrency(currency) {
    if (currency === 'SEND' || currency === 'RECEIVE') {
      this.router.navigate(['/pages/transfer']);
    }
    else if (currency === 'HEAVEN') {
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
