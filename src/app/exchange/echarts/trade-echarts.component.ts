import {Component, AfterViewInit, OnChanges, Input} from '@angular/core';

@Component({
  selector: 'ngx-trade-echarts',
  template: `
    <div echarts [options]="options" class="echart trade-chart-anx"></div>
  `,
})
export class TradeEchartsComponent implements AfterViewInit, OnChanges {
  options: any = {};
  themeSubscription: any;
  @Input() graphData: any;
  @Input() graphPair: any;

  constructor() {}

  ngOnChanges(): void {
    if (this.graphData)
      this.setGraph();
  }

  ngAfterViewInit() {
    if (this.graphData)
      this.setGraph();
  }

  setGraph() {
    this.options = {
      title: {
        text: this.graphPair,
        textStyle: {
          color: '#ffffff',
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      backgroundColor: '#1c1c1a',
      textStyle: {
        color: '#ffffff',
        fontSize: 10,
      },
      grid: {
        left: '2%',
        containLabel: true,
      },
      xAxis: {
        data: this.graphData.map(function (item) {
          return item[0];
        })
      },
      yAxis: {
        splitLine: {
          show: false
        }
      },
      toolbox: {
        left: 'center',
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: {zoom: 'Zoom', back: 'Back'}
          },
          restore: {
            title: 'Restore'
          },
          saveAsImage: {
            title: 'Save as Image'
          }
        }
      },
      dataZoom: [{
        // startValue: '2014-06-01',
        textStyle: {color: '#ffffff'},
      }, {
        type: 'inside'
      }],
      visualMap: {
        top: 10,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 50,
            color: '#096'
          }, {
            gt: 50,
            lte: 100,
            color: '#ffde33'
          }, {
            gt: 100,
            lte: 150,
            color: '#ff9933'
          }, {
            gt: 150,
            lte: 200,
            color: '#cc0033'
          }, {
            gt: 200,
            lte: 300,
            color: '#660099'
          }, {
            gt: 300,
            color: '#7e0023'
          }
        ],
        outOfRange: {
          color: '#999'
        },
        textStyle: {
          color: '#ffffff',
          fontSize: 10,
        },
      },
      series: {
        name: 'price',
        type: 'line',
        data: this.graphData.map(function (item) {
          return item[1];
        }),
        markLine: {
          silent: true,
          data: [{
            yAxis: 50
          }, {
            yAxis: 100
          }, {
            yAxis: 150
          }, {
            yAxis: 200
          }, {
            yAxis: 300
          }]
        }
      }
    };
  }
}
