import { Component, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { RewardChartComponent } from './charts/rewards-chart.component';
import { HeavenChartComponent } from './charts/heaven-chart.component';
import { RewardsChart } from '../../../@core/data/rewards-chart';
import { HeavenChart } from '../../../@core/data/heaven-chart';
import { HeavenChartSummary, HeavenSummaryChartData } from '../../../@core/data/heaven-summary-chart';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy {

  private alive = true;

  chartPanelSummary: HeavenChartSummary[];
  period: string = 'week';
  rewardsChartData: RewardsChart;
  heavenChartData: HeavenChart;

  @ViewChild('rewardsChart') rewardsChart: RewardChartComponent;
  @ViewChild('heavenChart') heavenChart: HeavenChartComponent;

  constructor(private heavenChartService: HeavenSummaryChartData) {
    this.heavenChartService.getHeavenChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.chartPanelSummary = summary;
      });

    this.getrewardsChartData(this.period);
    this.getheavenChartData(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getrewardsChartData(value);
    this.getheavenChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Reward') {
      this.heavenChart.resizeChart();
    } else {
      this.rewardsChart.resizeChart();
    }
  }

  getrewardsChartData(period: string) {
    this.heavenChartService.getRewardsChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(rewardsChartData => {
        this.rewardsChartData = rewardsChartData;
      });
  }

  getheavenChartData(period: string) {
    this.heavenChartService.getHeavenChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(heavenChartData => {
        this.heavenChartData = heavenChartData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
