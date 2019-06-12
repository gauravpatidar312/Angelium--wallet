import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {LocalDataSource} from 'ng2-smart-table';

import {SmartTableData} from '../../@core/data/smart-table';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'ngx-heaven',
  templateUrl: './heaven.component.html',
  styleUrls: ['./heaven.component.scss'],
})
export class HeavenComponent implements OnDestroy {
  private alive = true;
  heavenDrop: any;

  @Output() periodChange = new EventEmitter<string>();

  @Input() heavenType: string = 'week';
  @Input() heavenDropType: string = 'week';

  types: string[] = ['week', 'month', 'year'];
  heavenDropTypes: string[] = ['week', 'month', 'year'];
  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  currentTheme: string;

  totalHeaven = {
    heaven: 0,
    percentage: 0,
  };

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

  constructor(private service: SmartTableData,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private httpService: HttpService) {
    // const data = this.service.getData();
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
    this.getTotalHeaven();
    this.getTotalHeavenDrop();
    this.getHeavenGraph();
    this.getANXHistory();
    this.getHeavenReleaseSettings();
    this.getHeavenHistory();
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

  changePeriod(period: string, typeValue: string): void {
    if (typeValue === 'heaven')
      this.heavenType = period;
    else if (typeValue === 'heavenDrop')
      this.heavenDropType = period;
    this.periodChange.emit(period);
  }

  getTotalHeaven() {
    this.httpService.get('total-heaven?filter_type="week"').subscribe((res) => {
      console.log('total-heaven', res);
      // if (res.hasOwnProperty('heaven')) {
      //   this.totalHeaven.heaven = res.heaven;
      // }
      // if (res.hasOwnProperty('percentage')) {
      //   this.totalHeaven.percentage = res.percentage;
      // }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
  getTotalHeavenDrop() {
    this.httpService.get('heaven-drop?filter_type="week"').subscribe((res) => {
      console.log('drop', res);
    });
  }
  getHeavenGraph() {
    this.httpService.get('heaven-graph/').subscribe((res) => {
      console.log('getHeavenGraph', res);
    });
  }

  getANXHistory() {
    this.httpService.get('anx-history/').subscribe((res) => {
      console.log('anx-history', res);
    });
  }

  getHeavenReleaseSettings() {
    // this.httpService.get('heaven-release-settings').subscribe((res) => {
    //   console.log('settings', res);
    // });
  }

  getHeavenHistory() {
    this.httpService.get('heaven-history/').subscribe((res) => {
      console.log('heaven-history', res);
    });
  }
}
