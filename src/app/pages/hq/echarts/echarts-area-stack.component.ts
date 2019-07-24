import {AfterViewInit, Component, OnChanges, OnDestroy, Input} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsAreaStackComponent implements AfterViewInit, OnChanges, OnDestroy {
  options: any = {};
  themeSubscription: any;
  @Input() graphData: any;

  constructor(private theme: NbThemeService) {
  }

  ngOnChanges(): void {
    if (this.graphData)
      this.setUserGraph();
  }

  ngAfterViewInit() {
    if (this.graphData)
      this.setUserGraph();
  }

  setUserGraph() {
    const series = this.getNewSeries(this.graphData);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: this.graphData.data,
          textStyle: {
            color: echarts.textColor,
            fontSize: 15,
            fontStyle: 'NunitoSans'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.graphData.xAxis,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
                fontStyle: 'NunitoSans'
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
                fontStyle: 'NunitoSans'
              },
            },
          },
        ],
        series: series,
      };
    });
  }

  getNewSeries(userData) {
    return _.map(userData.series, (obj) => {
      const item: any = {};
      item.name = obj.name;
      item.data = obj.data;
      item.type = 'line';
      item.stack = 'Total amount';
      item.marker = {symbol: 'square', radius: 12};
      item.areaStyle = {normal: {opacity: echarts.areaOpacity}};
      return item;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
