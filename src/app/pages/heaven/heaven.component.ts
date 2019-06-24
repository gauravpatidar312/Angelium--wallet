import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { HttpService } from '../../services/http.service';
import * as _ from 'lodash';
import { ToastrService } from '../../services/toastr.service';
import { ShareDataService } from '../../services/share-data.service';
import { environment } from 'environments/environment';
import { CustomRendererComponent } from './custom.component';
// declare let $: any;
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
  totalHeaven: any;
  heavenType: string = 'week';
  heavenDropType: string = 'week';
  walletType: string = 'SELECT';
  types: string[] = ['week', 'month', 'year'];
  heavenDropTypes: string[] = ['week', 'month', 'year'];
  myWallets: string[];
  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  currentTheme: string;
  heaven_amount: any;
  wallet: any;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;

  constructor(private service: SmartTableData,
              private shareDataService: ShareDataService,
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
      hid: 'HD1038',
      heavenAmount: '28 BTC',
      plan: 'Heaven 90',
      totalReceive: '364 ANX',
      entryDate: '2019.03.19',
      releaseDate: '2019.03.19',
      releaseSetting: 'Another Heaven 90',
    },
    {
      hid: 'HD 1213',
      heavenAmount: '163 ETH',
      plan: 'Heaven 30',
      totalReceive: '364 ANX',
      entryDate: '2019.03.19',
      releaseDate: '2019.03.19',
      releaseSetting: 'Another Heaven 60',
    },
    ];
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
    this.getHeavenGraph();
    this.getANXHistory();
    this.getHeavenReleaseSettings();
    this.getHeavenHistory();
  }
  selectedHeavenPlan = '';


  settings = {
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    // add: '',
    // edit: '',
    // delete: '',

    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
    },
    editable: true,
    mode: 'inline',
    columns: {
      hid: {
        title: 'Heaven ID',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      heavenAmount: {
        title: 'Amount',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      plan: {
        title: 'Plan',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      totalReceive: {
        title: 'Received',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      entryDate: {
        title: 'Entry date',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      releaseDate: {
        title: 'Release date',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      releaseSetting: {
        title: 'Release Setting',
        type: 'custom',
        renderComponent: CustomRendererComponent,
        filter: false,
        class: 'heavenhistory-cell text-center',
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
      this.heaven_amount = Number(Number(this.wallet.wallet_amount).toFixed(6));
      this.setAmount(this.walletType);
    }
    this.periodChange.emit(period);
  }

  setAmount(walletType) {
    if (!this.heaven_amount || !this.wallet || !this.wallet.wallet_type) {
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

  setMaxValue() {
    if (!this.wallet || !this.wallet.wallet_amount) {
      return;
    }

    this.heaven_amount = Number(Number(this.wallet.wallet_amount).toFixed(6));
    this.setAmount(this.wallet.wallet_type);
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
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Heaven');
    });
  }

  getTotalHeaven() {
    this.httpService.get('total-heaven/').subscribe((res?: any) => {
      this.totalHeaven = res;
    });
  }

  getWallets() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      this.myWallets = _.sortBy(res, ['wallet_type']);
      if (!this.myWallets) {
        this.walletType = 'SELECT';
      } else if (this.shareDataService.transferTitle) {
        this.walletType = this.shareDataService.transferTitle;
        this.wallet = _.find(this.myWallets, ['wallet_type', this.walletType]) || {};
        this.heaven_amount = Number(Number(this.wallet.wallet_amount).toFixed(6));
        this.setAmount(this.walletType);
        this.shareDataService.transferTitle = null;
      }
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
