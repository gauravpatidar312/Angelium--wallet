import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { LiveUpdateChart, PieChart, EarningData } from '../data/earning';

@Injectable()
export class EarningService extends EarningData {

  private currentDate: Date = new Date();
  private currentValue = Math.random() * 1000;
  private ONE_DAY = 24 * 3600 * 1000;

  private pieChartData = [
    {
      value: 0,
      name: 'ANX',
    },
    {
      value: 0,
      name: 'BITCOIN',
    },
    {
      value: 0,
      name: 'TETHER',
    },
    {
      value: 0,
      name: 'ETHEREUM',
    },
  ];

  private liveUpdateChartData = {
    BITCOIN: {
      liveChart: [],
      delta: {
        up: true,
        value: 4,
      },
      dailyIncome: 45895,
    },
    TETHER: {
      liveChart: [],
      delta: {
        up: false,
        value: 9,
      },
      dailyIncome: 5862,
    },
    ETHEREUM: {
      liveChart: [],
      delta: {
        up: false,
        value: 21,
      },
      dailyIncome: 584,
    },
    ANX: {
      liveChart: [],
      delta: {
        up: true,
        value: 0,
      },
      dailyIncome: 0,
    },
    HEAVEN: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    ANL: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    XP: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    BTC: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    ETH: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    USDT: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    ANLP: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
    ERCUSDT: {
      liveChart: [],
      delta: {
        up: false,
        value: 0,
      },
      dailyIncome: 0,
    },
  };

  getDefaultLiveChartData(elementsNumber: number) {
    this.currentDate = new Date();
    this.currentValue = Math.random() * 1000;

    return Array.from(Array(elementsNumber))
      .map(item => this.generateRandomLiveChartData());
  }

  generateRandomLiveChartData() {
    this.currentDate = new Date(+this.currentDate + this.ONE_DAY);
    this.currentValue = this.currentValue + Math.random() * 20 - 11;

    if (this.currentValue < 0) {
      this.currentValue = Math.random() * 100;
    }

    return {
      value: [
        [
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate(),
        ].join('/'),
        Math.round(this.currentValue),
      ],
    };
  }

  getEarningLiveUpdateCardData(currency): Observable<any[]> {
    const data = this.liveUpdateChartData[currency.toUpperCase()];
    const newValue = this.generateRandomLiveChartData();

    data.liveChart.shift();
    data.liveChart.push(newValue);

    return observableOf(data.liveChart);
  }

  getEarningCardData(currency: string): Observable<LiveUpdateChart> {
    const data = this.liveUpdateChartData[currency.toUpperCase()];

    data.liveChart = this.getDefaultLiveChartData(150);

    return observableOf(data);
  }

  getEarningPieChartData(): Observable<PieChart[]> {
    return observableOf(this.pieChartData);
  }
}
