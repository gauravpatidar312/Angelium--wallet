import {delay, takeWhile} from 'rxjs/operators';
import {AfterViewInit, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import * as moment from 'moment';

@Component({
  selector: 'ngx-earning-live-update-chart',
  styleUrls: ['earning-card-front.component.scss'],
  template: `
    <div echarts
         class="echart"
         [options]="option"></div>
  `,
})
export class EarningLiveUpdateChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  private alive = true;
  @Input() liveUpdateChartData: { value: [string, number] }[];
  option: any;

  constructor(private theme: NbThemeService) {
  }

  ngOnChanges(): void {
    this.setChartOption();
  }

  ngAfterViewInit() {
    this.setChartOption();
  }

  setChartOption() {
    this.theme.getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive),
      )
      .subscribe(config => {
        const earningLineTheme: any = config.variables.earningLine;
        this.option = {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          xAxis: {
            type: 'time',
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            boundaryGap: [0, '5%'],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          tooltip: {
            axisPointer: {
              type: 'shadow',
            },
            textStyle: {
              color: earningLineTheme.tooltipTextColor,
              fontWeight: earningLineTheme.tooltipFontWeight,
              fontSize: earningLineTheme.tooltipFontSize,
            },
            position: 'top',
            backgroundColor: earningLineTheme.tooltipBg,
            borderColor: earningLineTheme.tooltipBorderColor,
            borderWidth: earningLineTheme.tooltipBorderWidth,
            formatter: (params) => {
              if (params.data.type === 'ANX' || params.data.type === 'HEAVEN')
                return `${moment(params.value[0], 'YYYY/MM/DD').format('MM.DD')} - ${Math.round(parseInt(params.value[1], 8))}`;
              else
                return `${moment(params.value[0], 'YYYY/MM/DD').format('MM.DD')} - $${Math.round(parseInt(params.value[1], 8))}`;
            },
            extraCssText: earningLineTheme.tooltipExtraCss,
          },
          series: [
            {
              type: 'line',
              symbol: 'circle',
              sampling: 'average',
              itemStyle: {
                normal: {
                  opacity: 0,
                },
                emphasis: {
                  opacity: 0,
                },
              },
              lineStyle: {
                normal: {
                  width: 0,
                },
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: earningLineTheme.gradFrom,
                  }, {
                    offset: 1,
                    color: earningLineTheme.gradTo,
                  }]),
                  opacity: 1,
                },
              },
              data: this.liveUpdateChartData,
            },
          ],
          animation: true,
        };
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
