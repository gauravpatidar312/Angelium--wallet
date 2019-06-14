import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';

@Component({
  selector: 'ngx-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent implements OnDestroy {

  private alive = true;
  @Output() periodChange = new EventEmitter<string>();
  typeOfDay: string;
  typeOfMonth: string;
  typeOfYear: string;
  typeOfCountry: string;
  typeOfIdFrom: string;
  typeOfIdBack: string;
  typeOfProofOfAddress: string;
  types: any = {
    'day': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'month': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'year': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'country': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'idFrom': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'idBack': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'proofOfAddress': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  };
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
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  changePeriod(period: string, typeValue): void {
    if (typeValue === 'day')
      this.typeOfDay = period;
    else if (typeValue === 'month')
      this.typeOfMonth = period;
    else if (typeValue === 'year')
      this.typeOfYear = period;
    else if (typeValue === 'country')
      this.typeOfCountry = period;
    else if (typeValue === 'idFrom')
      this.typeOfIdFrom = period;
    else if (typeValue === 'idBack')
      this.typeOfIdBack = period;
    else if (typeValue === 'proofOfAddress')
      this.typeOfProofOfAddress = period;
    this.periodChange.emit(period);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
