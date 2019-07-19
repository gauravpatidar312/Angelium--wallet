import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsAreaStackComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
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
          data: ['Total Heaven', 'New Heaven', 'Releasable', 'Released', 'Gain Paid', 'Commission Paid','Profit'],
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
            data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
        series: [
          {
            name: 'Total Heaven',
            type: 'line',
            legendMarkerType: 'triangle',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: 'New Heaven',
            type: 'line',
            stack: 'Total amount',
            marker : {symbol : 'square',radius : 12 },
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: 'Releasable',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: 'Released',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: 'Gain Paid',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: 'Commission Paid',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: 'Profits',
            type: 'line',
            stack: 'Total amount',
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: echarts.textColor,
                  fontStyle: 'NunitoSans'
                },
              },
            },
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
