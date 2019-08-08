import {delay, takeWhile} from 'rxjs/operators';
import {AfterViewInit, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-traffic-chart',
  styleUrls: ['./traffic.component.scss'],
  template: `
    <div class="chart-info">
      <div class="title">{{trafficValue}}
        <!--
          <span class="title-price">%</span>
        -->
      </div>
    </div>
    <div echarts
         [options]="option"
         class="echart"
         (chartInit)="onChartInit($event)">
    </div>
  `,
})
export class TrafficChartComponent implements AfterViewInit, OnChanges, OnDestroy {

  private alive = true;

  @Input() points: number[];
  @Input() trafficValue: number;

  type = this.translate.instant('common.month');
  types = [this.translate.instant('common.week'), this.translate.instant('common.month'), this.translate.instant('common.year')];
  option: any = {};
  echartsIntance: any;

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService,
              private translate: TranslateService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      ).subscribe(() => this.resizeChart());

  }

  ngOnChanges(): void {
    this.onSetChart();
  }

  ngAfterViewInit() {
    this.onSetChart();
  }

  onSetChart() {
    this.theme.getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive),
      )
      .subscribe(config => {
        const trafficTheme: any = config.variables.traffic;

        this.option = Object.assign({}, {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.points,
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
              lineStyle: {
                color: trafficTheme.colorBlack,
                opacity: 0.06,
                width: '1',
              },
            },
          },
          tooltip: {
            axisPointer: {
              type: 'shadow',
            },
            textStyle: {
              color: trafficTheme.tooltipTextColor,
              fontWeight: trafficTheme.tooltipFontWeight,
              fontSize: trafficTheme.tooltipFontSize,
            },
            position: 'top',
            backgroundColor: trafficTheme.tooltipBg,
            borderColor: trafficTheme.tooltipBorderColor,
            borderWidth: trafficTheme.tooltipBorderWidth,
            formatter: '{c0}',
            extraCssText: trafficTheme.tooltipExtraCss,
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
                    color: trafficTheme.gradFrom,
                  }, {
                    offset: 1,
                    color: trafficTheme.gradTo,
                  }]),
                  opacity: 1,
                },
              },
              data: this.points,
            },
          ],
        });
      });
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      this.echartsIntance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
