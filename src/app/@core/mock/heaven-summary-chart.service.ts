import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RewardsChart, RewardsChartData } from '../data/rewards-chart';
import { HeavenChartSummary, HeavenSummaryChartData } from '../data/heaven-summary-chart';
import { HeavenChart, HeavenChartData } from '../data/heaven-chart';

@Injectable()
export class HeavenSummaryChartService extends HeavenSummaryChartData {

  private summary = [
    {
      title: 'Total',
      value: 3654,
    },
    {
      title: 'Last Month',
      value: 946,
    },
    {
      title: 'Last Week',
      value: 654,
    },
    {
      title: 'Today',
      value: 230,
    },
  ];

  constructor(private rewardChartService: RewardsChartData,
              private heavenChartService: HeavenChartData) {
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
