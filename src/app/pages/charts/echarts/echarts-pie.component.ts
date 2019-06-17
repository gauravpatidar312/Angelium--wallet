import { OnChanges, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
  styleUrls: ['./echarts.component.scss'],
})
export class EchartsPieComponent implements OnChanges, OnDestroy {
  @Input() dataSource: any;
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngOnChanges() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        /*legend: {
          orient: 'vertical',
          left: 'left',
          data: ['ANX', 'HEAVEN', 'ANL', 'XP', 'BTC', 'ETH', 'USDT', 'ANLP'],
          textStyle: {
            color: echarts.textColor,
          },
        },*/
        series: [
          {
            name: 'Portfolio',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.dataSource,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
