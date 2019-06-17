import {Component, EventEmitter, OnInit, OnDestroy, Output} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {LocalDataSource} from 'ng2-smart-table';
import {SmartTableData} from '../../@core/data/smart-table';
import {HttpService} from '../../services/http.service';
import * as _ from 'lodash';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';
import {environment} from 'environments/environment';

@Component({
  selector: 'ngx-heaven',
  templateUrl: './heaven.component.html',
  styleUrls: ['./heaven.component.scss'],
})
export class HeavenComponent implements OnInit, OnDestroy {
  @Output() periodChange = new EventEmitter<string>();
  private alive = true;
  isProduction: any = environment.production;
  heavenDrop: any;
  heavenType: string = 'week';
  heavenDropType: string = 'week';
  walletType: string = 'SELECT';
  types: string[] = ['week', 'month', 'year'];
  heavenDropTypes: string[] = ['week', 'month', 'year'];
  myWallets: string[];
  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  currentTheme: string;
  heaven_amount: any;
  wallet: any;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;

  constructor(private service: SmartTableData,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private httpService: HttpService,
              private toastrService: ToastrService ) {
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
  }

  ngOnInit() {
    const data = [{
      hid: 12842,
      heavenAmount: '$193,393',
      plan: 'Heaven 30',
      totalReceive: '122,31ANX',
      entryDate: '2019.02.19',
      releaseDate: '2019.04.19',
      releaseSetting: '<i class="fas fa-arrow-left text-warning"></i> Another Heaven',
    },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '<i class="fas fa-arrow-right text-muted"></i> Release',
      },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '<i class="fas fa-arrow-right text-muted"></i> Release',
      },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '<i class="fas fa-arrow-right text-muted"></i> Release',
      },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '<i class="fas fa-arrow-right text-success"></i> Release',
      },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '<i class="fas fa-arrow-right text-muted"></i> Release',
      },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '<i class="fas fa-arrow-right text-muted"></i> Release',
      },
      {
        hid: 12842,
        heavenAmount: '$193,393',
        plan: 'Heaven 30',
        totalReceive: '122,31ANX',
        entryDate: '2019.02.19',
        releaseDate: '2019.04.19',
        releaseSetting: '2019.0419',
      }];
    this.source.load(data);
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

    this.httpService.get('heaven-drop/').subscribe(res => {
      this.heavenDrop = res;
    });

    this.getWallets();
    this.getTotalHeaven();
    this.getTotalHeavenDrop();
    this.getHeavenGraph();
    this.getANXHistory();
    this.getHeavenReleaseSettings();
    this.getHeavenHistory();
  }
  totalHeaven = {
    heaven: 0,
    percentage: 0,
  };

  selectedHeavenPlan = '';

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
      hid: {
        title: 'HID',
        type: 'number',
      },
      heavenAmount: {
        title: 'Heaven Amount',
        type: 'string',
      },
      plan: {
        title: 'Plan',
        type: 'string',
      },
      totalReceive: {
        title: 'Total Receive',
        type: 'string',
      },
      entryDate: {
        title: 'Entry date',
        type: 'string',
      },
      releaseDate: {
        title: 'Release date',
        type: 'string',
      },
      releaseSetting: {
        title: 'Release Setting',
        type: 'html',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  changePeriod(period: string, typeValue: string): void {
    if (typeValue === 'heaven')
      this.heavenType = period;
    else if (typeValue === 'heavenDrop')
      this.heavenDropType = period;
    else if (typeValue === 'createHeaven') {
      this.walletType = period;
      this.wallet = _.find(this.myWallets, ['wallet_type', this.walletType]) || {};
      this.heaven_amount = Number(this.wallet.wallet_amount);
      this.setAmount(this.walletType);
    }
    this.periodChange.emit(period);
  }

  setAmount(walletType) {
    if (!this.heaven_amount) {
      this.wallet.walletDollar = 0;
      return;
    }

    this.fetchingAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.wallet.walletDollar = Number(this.heaven_amount) * data[walletType];
      this.fetchingAmount = false;
    }, (err) => {
      this.fetchingAmount = false;
      this.wallet.walletDollar = 0;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
    });
  }

  onCreateHeaven() {
    if (!this.heaven_amount) {
      this.toastrService.danger('Please enter amount.', 'Heaven');
      return;
    }

    if (!this.selectedHeavenPlan) {
      this.toastrService.danger('Please choose plan.', 'Heaven');
      return;
    }

    if (Number(this.heaven_amount) > Number(this.wallet.wallet_amount)) {
      this.toastrService.danger('You don\'t have sufficient balance.', 'Heaven');
      return;
    }

    const obj = {
      'heaven_amount': this.heaven_amount,
      'plan': this.selectedHeavenPlan,
      'user_wallet': this.wallet.id,
    };
    this.formSubmitting = true;
    this.httpService.post(obj, 'create-heaven/').subscribe((res?: any) => {
      if (res.status) {
        this.formSubmitting = false;
        this.toastrService.success('Transaction successfully completed!', 'Heaven');
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(res.message, 'Heaven');
      }
    }, (err) => {
      this.formSubmitting = false;
      this.toastrService.danger(err.error.message || ShareDataService.getErrorMessage(err), 'Heaven');
    });
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

  getWallets() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      this.myWallets = _.sortBy(res, ['wallet_type']);
      if (this.myWallets && Object.keys(this.myWallets).length){
        this.walletType = 'BTC';
        this.wallet = _.find(this.myWallets, ['wallet_type', this.walletType]) || {};
        this.heaven_amount = Number(this.wallet.wallet_amount);
        this.setAmount(this.walletType);
      } else
        this.walletType = 'SELECT';
    });
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

  ngOnDestroy() {
    this.alive = false;
  }
}
