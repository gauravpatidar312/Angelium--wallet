import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'ngx-chart-panel-header',
  styleUrls: ['./chart-panel-header.component.scss'],
  templateUrl: './chart-panel-header.component.html',
})
export class ChartPanelHeaderComponent implements OnChanges, OnDestroy {

  private alive = true;
  @Output() periodChange = new EventEmitter<string>();
  @Input() typeData: any;
  @Input() type: string = 'today';
  types: string[] = ['today', 'week', 'month', 'total'];

  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  orderProfitLegend: any;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.orderProfitLegend = theme.variables.orderProfitLegend;
        this.setLegendItems(this.orderProfitLegend);
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnChanges() {
    this.setLegendItems(this.orderProfitLegend);
  }

  setLegendItems(orderProfitLegend) {
    if (this.typeData === 'assets') {
      this.chartLegend = [
        {
          iconColor: orderProfitLegend.firstItem,
          title: 'ANX',
        },
        {
          iconColor: orderProfitLegend.secondItem,
          title: 'HEAVEN',
        },
        {
          iconColor: orderProfitLegend.thirdItem,
          title: 'ANL',
        },
        {
          iconColor: orderProfitLegend.fourItem,
          title: 'XP',
        },
        {
          iconColor: orderProfitLegend.fiveItem,
          title: 'BTC',
        },
        {
          iconColor: orderProfitLegend.sixItem,
          title: 'ETH',
        },
        {
          iconColor: orderProfitLegend.sevenItem,
          title: 'USDT',
        },
        {
          iconColor: orderProfitLegend.eightItem,
          title: 'ANLP',
        },
      ];
    } else {
      this.chartLegend = [
        {
          iconColor: orderProfitLegend.firstItem,
          title: 'ANX',
        },
      ];
    }
  }

  changePeriod(period: string): void {
    this.type = period;
    this.periodChange.emit(period);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
