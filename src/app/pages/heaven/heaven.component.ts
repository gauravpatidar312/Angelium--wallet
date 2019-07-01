import { Component, EventEmitter, OnInit, OnDestroy, AfterViewInit, Output } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { HttpService } from '../../services/http.service';
import * as _ from 'lodash';

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from '../../services/toastr.service';
import { ShareDataService } from '../../services/share-data.service';
import { environment } from 'environments/environment';
import { CustomRendererComponent } from './custom.component';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'ngx-heaven',
  templateUrl: './heaven.component.html',
  styleUrls: ['./heaven.component.scss'],
})
export class HeavenComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() periodChange = new EventEmitter<string>();
  private alive = true;
  isProduction: any = environment.production;
  heavenDrop: any;
  totalHeaven: any;
  heavenType: string = 'week';
  heavenDropType: string = 'week';
  walletType: string = this.translate.instant('common.select');
  types: string[] = ['week', 'month', 'year'];
  heavenDropTypes: string[] = ['week', 'month', 'year'];
  myWallets: string[];
  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  currentTheme: string;
  heaven_amount: any;
  wallet: any;
  maxAmount: number;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;
  days:any;
  fetchingTotalHeaven: boolean = false;
  fetchingHeavenDrop: boolean = false;
  fetchHeavenHistory: boolean = false;

  constructor(private service: SmartTableData,
              private shareDataService: ShareDataService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private httpService: HttpService,
              private toastrService: ToastrService,
              public translate: TranslateService) {
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

    this.translate.get('days').subscribe((res: any) => {
      this.days = res;
      console.log(res);
    });
  }

  ngOnInit() {
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

    this.getWallets();
    this.getTotalHeaven();
    this.getHeavenDrop();
    this.getHeavenGraph();
    this.getANXHistory();
    this.getHeavenReleaseSettings();
    this.getHeavenHistory('total');
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
    noDataMessage: this.translate.instant('pages.heaven.noDataFound'),
    columns: {
      hid: {
        title: this.translate.instant('pages.heaven.heavenId'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      heaven_amount: {
        title: this.translate.instant('common.amount'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      currency_type: {
        title: this.translate.instant('common.assets'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      plan: {
        title: this.translate.instant('pages.heaven.plan'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      total_received: {
        title: this.translate.instant('pages.heaven.received'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      entry_date: {
        title: this.translate.instant('pages.heaven.entryDate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      release_date: {
        title: this.translate.instant('pages.heaven.releaseDate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell">${cell}</div>`;
        },
      },
      release_settings: {
        title: this.translate.instant('pages.heaven.releaseSetting'),
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
      this.maxAmount = ShareDataService.toFixedDown(this.wallet.wallet_amount, 6);
      this.heaven_amount = this.maxAmount;
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
      this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('pages.dashboard.toastr.fetchingAmount'));
    });
  }

  setMaxValue() {
    if (!this.wallet || !this.wallet.wallet_amount) {
      return;
    }

    this.heaven_amount = ShareDataService.toFixedDown(this.wallet.wallet_amount, 6);
    this.setAmount(this.wallet.wallet_type);
  }

  onCreateHeaven() {
    if (!this.heaven_amount) {
      this.toastrService.danger(this.translate.instant('.pages.heaven.toastr.pleaseEnterAmount'), this.translate.instant('common.heaven'));
      return;
    }

    if (!this.selectedHeavenPlan) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.pleaseChoosePlan'), this.translate.instant('common.heaven'));
      return;
    }

    if (Number(this.heaven_amount) > ShareDataService.toFixedDown(this.wallet.wallet_amount, 6)) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.youDontHaveSufficientBalance'), this.translate.instant('common.heaven'));
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
        this.toastrService.success(this.translate.instant('pages.heaven.toastr.transactionSuccessfullyCompleted'), this.translate.instant('common.heaven'));
        this.getWallets();
        this.heaven_amount = null;
        this.selectedHeavenPlan = null;
        this.changePeriod('SELECT', 'createHeaven');
        this.setAmount('SELECT');
        this.getHeavenHistory('total');
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(res.message, this.translate.instant('common.heaven'));
      }
    }, (err) => {
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }

  getHeavenDrop() {
    this.fetchingHeavenDrop = true;
    this.httpService.get('heaven-drop/').subscribe(res => {
      this.heavenDrop = res;
      this.fetchingHeavenDrop = false;
    }, (err) => {
      this.fetchingHeavenDrop = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }
  getTotalHeaven() {
    this.fetchingTotalHeaven = true;
    this.httpService.get('total-heaven/').subscribe((res?: any) => {
      this.totalHeaven = res;
      this.fetchingTotalHeaven = false;
    }, (err) => {
      this.fetchingTotalHeaven = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
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
        this.heaven_amount = ShareDataService.toFixedDown(this.wallet.wallet_amount, 6);
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

  getHeavenHistory(value) {
    $('.heaven-history-spinner').height($('#heaven-history').height());
    this.fetchHeavenHistory = true;
    this.httpService.get(`heaven-history/?filter_type=${value}`).subscribe((res?: any) => {
      const data = res.results;
      const heaven_history_data = _.map(data, function(obj) {
        obj.entry_date = moment(obj.entry_date, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.release_date = moment(obj.release_date, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.total_received = (ShareDataService.toFixedDown(obj.total_received, 2)) + ' ANX';
        obj.heaven_amount = ShareDataService.toFixedDown(obj.heaven_amount, 6);
        return obj;
      });
      this.source.load(heaven_history_data);
      this.fetchHeavenHistory = false;
    }, (err) => {
      this.fetchHeavenHistory = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }

  ngAfterViewInit() {
    $('ul.downLine li a').click(function (e) {
      $('ul.downLine li.active').removeClass('active');
      $(this).parent('li').addClass('active');
    });
  }

  ngOnDestroy() {
    this.alive = false;
}
}
