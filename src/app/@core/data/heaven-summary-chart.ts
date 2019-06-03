import { Observable } from 'rxjs';
import { RewardsChart } from './rewards-chart';
import { HeavenChart } from './heaven-chart';

export interface HeavenChartSummary {
  title: string;
  value: number;
}

export abstract class HeavenSummaryChartData {
  abstract getHeavenChartSummary(): Observable<HeavenChartSummary[]>;
  abstract getRewardsChartData(period: string): Observable<RewardsChart>;
  abstract getHeavenChartData(period: string): Observable<HeavenChart>;
}
