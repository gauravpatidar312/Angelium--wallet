export interface HeavenChart {
  chartLabel: string[];
  data: number[][];
}

export abstract class HeavenChartData {
  abstract getHeavenChartData(period: string): HeavenChart;
}
