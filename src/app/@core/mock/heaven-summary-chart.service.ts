import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RewardsChart, RewardsChartData } from '../data/rewards-chart';
import { HeavenChartSummary, HeavenSummaryChartData } from '../data/heaven-summary-chart';
import { HeavenChart, HeavenChartData } from '../data/heaven-chart';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HeavenSummaryChartService extends HeavenSummaryChartData {

  private summary = [
    {
      title: this.translate.instant('common.total'),
      value: 3654,
    },
    {
      title: this.translate.instant('common.lastMonth'),
      value: 946,
    },
    {
      title: this.translate.instant('common.lastWeek'),
      value: 654,
    },
    {
      title: this.translate.instant('common.today'),
      value: 230,
    },
  ];

  constructor(private rewardChartService: RewardsChartData,
              private heavenChartService: HeavenChartData,
              private translate: TranslateService) {
    super();
  }

  getHeavenChartSummary(): Observable<HeavenChartSummary[]> {
    return observableOf(this.summary);
  }

  getRewardsChartData(period: string): Observable<RewardsChart> {
    return observableOf(this.rewardChartService.getRewardsChartData(period));
  }

  getHeavenChartData(period: string): Observable<HeavenChart> {
    return observableOf(this.heavenChartService.getHeavenChartData(period));
  }
}
