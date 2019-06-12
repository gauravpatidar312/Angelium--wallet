import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';

import { HttpService } from "../../services/http.service";
import { SmartTableData } from '../../@core/data/smart-table';

@Component({
  selector: 'ngx-heaven',
  templateUrl: './heaven.component.html',
  styleUrls: ['./heaven.component.scss'],
})
export class HeavenComponent {
  private alive = true;
  heavenDrop: any;

  @Output() periodChange = new EventEmitter<string>();

  @Input() type: string = 'week';

  types: string[] = ['week', 'month', 'year'];
  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  currentTheme: string;

  selectedHevenPlan = '';

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    // add: '',
    // edit: '',
    // delete: '',
    actions: false,
    columns: {
      id: {
        title: 'HID',
        type: 'number',
      },
      firstName: {
        title: 'Heaven Amount',
        type: 'string',
      },
      lastName: {
        title: 'Plan',
        type: 'string',
      },
      username: {
        title: 'Total Receive',
        type: 'string',
      },
      email: {
        title: 'Entry date',
        type: 'string',
      },
      age: {
        title: 'Release date',
        type: 'html',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService, private httpService: HttpService) {
    // const data = this.service.getData();
    const data = [{
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-left text-warning"></i> Another Heaven',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-right text-muted"></i> Release',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-right text-muted"></i> Release',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-right text-muted"></i> Release',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-right text-success"></i> Release',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-right text-muted"></i> Release',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '<i class="fas fa-arrow-right text-muted"></i> Release',
    },
    {
      id: 12842,
      firstName: '$193,393',
      lastName: 'Heaven 30',
      username: '122,31ANX',
      email: '2019.02.19',
      age: '2019.0419',
    },];
    this.source.load(data);
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        const orderProfitLegend = theme.variables.orderProfitLegend;

        this.currentTheme = theme.name;
        this.setLegendItems(orderProfitLegend);
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });

    this.httpService.get('heaven-drop/').subscribe(res => {
      this.heavenDrop = res;
    });

    this.httpService.get('user-wallet-address/').subscribe(res => {
      
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  setLegendItems(orderProfitLegend) {
    this.chartLegend = [
      {
        iconColor: orderProfitLegend.firstItem,
        title: 'Payment',
      },
      {
        iconColor: orderProfitLegend.secondItem,
        title: 'Canceled',
      },
      {
        iconColor: orderProfitLegend.thirdItem,
        title: 'All orders',
      },
    ];
  }

  changePeriod(period: string): void {
    this.type = period;
    this.periodChange.emit(period);
  }


}
