import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval , Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { LiveUpdateChart, EarningData } from '../../../../@core/data/earning';

@Component({
  selector: 'ngx-earning-card-front',
  styleUrls: ['./earning-card-front.component.scss'],
  templateUrl: './earning-card-front.component.html',
})
export class EarningCardFrontComponent implements OnDestroy, OnInit {
  private alive = true;

  @Input() selectedCurrency: string = 'Bitcoin';

  intervalSubscription: Subscription;
  currencies: string[] = ['Bitcoin', 'Tether', 'Ethereum'];
  currentTheme: string;
  earningLiveUpdateCardData: LiveUpdateChart;
  liveUpdateChartData: { value: [string, number] }[];

  constructor(private themeService: NbThemeService,
              private earningService: EarningData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit() {
    this.getEarningCardData(this.selectedCurrency);
    let element1 = document.getElementById('curr1').getElementsByClassName('curre');
    element1[0].innerHTML = 'ANX';
    let element2 = document.getElementById('curr2').getElementsByClassName('curre');
    element2[0].innerHTML = 'Average ANX';
    let element3 = document.getElementById('curr3').getElementsByClassName('curre');
    element3[0].innerHTML = 'Average Heaven';
    let element4 = document.getElementById('curr4').getElementsByClassName('curre');
    element4[0].innerHTML = 'Heaven growth';
    let element5 = document.getElementById('curr5').getElementsByClassName('curre');
    element5[0].innerHTML = 'Total user';
    let element6 = document.getElementById('curr6').getElementsByClassName('curre');
    element6[0].innerHTML = 'New user';
    let element7 = document.getElementById('curr7').getElementsByClassName('curre');
    element7[0].innerHTML = 'Leaving user';
    let element8 = document.getElementById('curr8').getElementsByClassName('curre');
    element8[0].innerHTML = 'User growth';
  }
  // changeCurrency(currency) {
  //   if (this.selectedCurrency !== currency) {
  //     this.selectedCurrency = currency;

  //     this.getEarningCardData(this.selectedCurrency);
  //   }
  // }

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
