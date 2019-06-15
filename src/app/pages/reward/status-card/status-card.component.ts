import {Component, Input, Output, OnDestroy, EventEmitter} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  templateUrl: './status-card.component.html',
})
export class StatusCardComponent implements OnDestroy {

  private alive = true;
  @Output() periodChange = new EventEmitter<string>();
  @Input() title: string;
  @Input() type: any;
  @Input() value: string;
  @Input() percentage: string;
  @Input() on = true;
  @Input() typeOfPeriod: string = 'week';
  selectedType = '1';
  types: string[] = ['week', 'month', 'year'];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  currentTheme: string;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  changePeriod(period: string): void {
    this.typeOfPeriod = period;
    this.periodChange.emit(period);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
