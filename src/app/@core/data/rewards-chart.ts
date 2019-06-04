export interface RewardsChart {
  chartLabel: string[];
  linesData: number[][];
}

export abstract class RewardsChartData {
  abstract getRewardsChartData(period: string): RewardsChart;
}
