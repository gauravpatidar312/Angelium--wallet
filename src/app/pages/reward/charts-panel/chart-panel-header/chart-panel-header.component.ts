import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-chart-panel-header',
  styleUrls: ['./chart-panel-header.component.scss'],
  templateUrl: './chart-panel-header.component.html',
})
export class ChartPanelHeaderComponent implements OnDestroy {

  private alive = true;

  @Output() periodChange = new EventEmitter<string>();

  @Input() type: string = 'week';

  types: string[] = ['week', 'month', 'year'];
  chartLegend: {iconColor: string; title: string}[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.setLegendItems(theme.variables.orderProfitLegend);
      });

      this.breakpoints = this.breakpointService.getBreakpointsMap();
      this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
          this.breakpoint = newValue;
        });
  }

  setLegendItems(orderProfitLegend) {
    this.chartLegend = [
      {
        iconColor: orderProfitLegend.firstItem,
        title: 'Lv.10',
      },
      {
        iconColor: orderProfitLegend.secondItem,
        title: 'Lv.4',
      },
      {
        iconColor: orderProfitLegend.thirdItem,
        title: 'Lv.8',
      },
    ];
  }

  changePeriod(period: string): void {
    this.type = period;
    this.periodChange.emit(period);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
