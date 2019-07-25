import { Component, Input, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'ngx-chart-line',
  styleUrls: ['./chart-line.component.scss'],
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class ChartLineComponent implements OnDestroy, OnChanges, AfterViewInit {
  data: any;
  options: any;
  @Input() graphData: any;
  themeSubscription: any;

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
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: this.graphData.xAxis,
        datasets: [{
          data: this.graphData.series[0].data,
          label: this.graphData.series[0].name,
          backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
          borderColor: colors.primary,
        }, {
          data: this.graphData.series[1].data,
          label: this.graphData.series[1].name,
          backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
          borderColor: colors.danger,
        }
        ],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                beginAtZero: true,
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
