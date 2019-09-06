import {Component, EventEmitter, OnInit, OnDestroy, AfterViewInit, Output} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {LocalDataSource} from 'ng2-smart-table';
import {SmartTableData} from '../../@core/data/smart-table';
import {HttpService} from '../../services/http.service';
import * as _ from 'lodash';

import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';
import {environment} from 'environments/environment';
import {CustomRendererComponent} from './custom.component';
import {SessionStorageService} from '../../services/session-storage.service';
import * as moment from 'moment';

declare let jQuery: any;

interface CardSettings {
  title: string;
  value: number;
  value_anx: number;
  fetchingValue: boolean;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-new-heaven',
  templateUrl: './new-heaven.component.html',
  styleUrls: ['./new-heaven.component.scss']
})
export class NewHeavenComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() periodChange = new EventEmitter<string>();
  private alive = true;
  minerFee: number = 0;
  minMinutes: number = 0;
  maxMinutes: number = 0;
  fees: number[] = [10, 20, 30];
  isProduction: any = environment.production;
  user: any;
  heavenDrop: any;
  heavenType: string = 'week';
  heavenDropType: string = 'week';
  walletType: string = this.translate.instant('common.select');
  types: string[] = ['week', 'month', 'year'];
  heavenDropTypes: string[] = ['week', 'month', 'year'];
  myWallets: string[];
  chartLegend: { iconColor: string; title: string }[];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  heaven_amount: any;
  wallet: any;
  maxAmount: number = 0;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;
  fetchHeavenHistory: boolean = false;
  fetchHeavenDropHistory: boolean = false;

  totalHeavenDropCard: CardSettings = {
    title: this.translate.instant('pages.heaven.heavenDropTotal'),
    value: 0,
    value_anx: 0,
    fetchingValue: true,
    iconClass: 'fa fa-university',
    type: 'primary',
  };
  todayHeavenDropCard: CardSettings = {
    title: this.translate.instant('pages.heaven.heavenDropToday'),
    value: 0,
    value_anx: 0,
    fetchingValue: true,
    iconClass: 'nb-bar-chart',
    type: 'primary',
  };

  statusCards: CardSettings[] = [
    this.totalHeavenDropCard,
    this.todayHeavenDropCard,
  ];

  constructor(private decimalPipe: DecimalPipe,
              private shareDataService: ShareDataService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private httpService: HttpService,
              private toastrService: ToastrService,
              private sessionStorage: SessionStorageService,
              public translate: TranslateService) {
    this.user = this.sessionStorage.getFromSession('userInfo');

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit() {
    this.getWallets();
    this.getHeavenDrop();
    this.getHeavenGraph();
    this.getANXHistory();
    this.getHeavenReleaseSettings();
    this.getHeavenHistory();
    this.getHeavenDropHistory();
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
      display: true,
    },
    editable: true,
    mode: 'inline',
    noDataMessage: this.translate.instant('pages.heaven.noDataFound'),
    columns: {
      heaven_id: {
        title: this.translate.instant('pages.heaven.heavenId'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      heaven_amount: {
        title: this.translate.instant('pages.heaven.heavenAmount'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell} <span class="text-success">${row.title}</span></div>`;
        },
      },
      plan: {
        title: this.translate.instant('pages.heaven.plan'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      total_received: {
        title: this.translate.instant('pages.heaven.received'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell} <span class="text-success">ANX</span></div>`;
        },
      },
      entry_date: {
        title: this.translate.instant('pages.heaven.entryDate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      release_date: {
        title: this.translate.instant('pages.heaven.releaseDate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      release_settings: {
        title: this.translate.instant('pages.heaven.releaseSetting'),
        type: 'custom',
        renderComponent: CustomRendererComponent,
        filter: false,
        class: 'heavenhistory-cell text-center td-width',
        onComponentInitFunction: (instance) => {
          instance.onReleaseFailed.subscribe((row) => {
            this.source.update(row, row); // to refresh the row to re-render UI.
          });
          instance.onReleaseSaved.subscribe((row) => {
            this.getHeavenHistory(); // to API call on release successfully.
          });
          instance.onReleaseRefresh.subscribe((row) => {
            this.source.refresh(); // to refresh row on release button click to show spinner.
          });
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  heavenDrops = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: true,
    },
    editable: true,
    mode: 'inline',
    noDataMessage: this.translate.instant('pages.heaven.noDataFound'),
    columns: {
      created: {
        title: this.translate.instant('common.date'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      hid: {
        title: this.translate.instant('pages.heaven.heavenId'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      plan: {
        title: this.translate.instant('pages.heaven.plan'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      amount: {
        title: this.translate.instant('pages.heaven.heavenDrop'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell} <span class="text-success">${row.title}</span></div>`;
        },
      },
    },
  };

  source_heavenDrop: LocalDataSource = new LocalDataSource();

  changePeriod(period: string, typeValue: string): void {
    if (typeValue === 'heaven')
      this.heavenType = period;
    else if (typeValue === 'heavenDrop')
      this.heavenDropType = period;
    else if (typeValue === 'createHeaven') {
      const walletObject: any = _.find(this.myWallets, ['wallet_type', period]);
      this.walletType = walletObject.title;
      this.wallet = _.find(this.myWallets, ['wallet_type', period]) || {};
      this.maxAmount = ShareDataService.toFixedDown(this.wallet.wallet_amount, 6);
      this.heaven_amount = this.wallet.wallet_amount;
      this.setAmount(period);
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
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  setMinerFee(fee: number) {
    this.minerFee = fee;
    if (this.minerFee === 10) {
      this.minMinutes = 20;
      this.maxMinutes = 50;
    } else if (this.minerFee === 20) {
      this.minMinutes = 10;
      this.maxMinutes = 20;
    } else if (this.minerFee === 30) {
      this.minMinutes = 5;
      this.maxMinutes = 10;
    }
  }

  setMaxValue() {
    if (!this.wallet || !this.wallet.wallet_amount) {
      return;
    }

    this.heaven_amount = this.wallet.wallet_amount;
    this.setAmount(this.wallet.wallet_type);
  }

  onCreateHeaven() {
    if (this.formSubmitting)
      return;

    if (this.wallet.wallet_type === 'USDT' && !this.minerFee) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.minerFeeError'),
        this.translate.instant('common.heaven'));
      return;
    }

    if (!this.heaven_amount) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.pleaseEnterAmount'), this.translate.instant('common.heaven'));
      return;
    }

    if (!this.selectedHeavenPlan) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.pleaseChoosePlan'), this.translate.instant('common.heaven'));
      return;
    }

    if (Number(this.heaven_amount) > this.wallet.wallet_amount) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.youDontHaveSufficientBalance'), this.translate.instant('common.heaven'));
      return;
    }

    let validateEndpoint = '';
    if (this.wallet.wallet_type === 'BTC')
      validateEndpoint = 'validate_btc/';
    else if (this.wallet.wallet_type === 'USDT')
      validateEndpoint = 'validate_usdt/';
    if (validateEndpoint) {
      this.formSubmitting = true;
      this.httpService.post({'amount': this.heaven_amount}, validateEndpoint).subscribe((res?: any) => {
        if (res.status)
          this.createHeavenApi();
        else {
          this.formSubmitting = false;
          this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.heaven'));
        }
      }, (err) => {
        this.formSubmitting = false;
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
      });
    } else
      this.createHeavenApi();
  }

  createHeavenApi() {
    const obj: any = {
      'invest_amount': this.heaven_amount,
      'plan': this.selectedHeavenPlan,
      'user_wallet': this.wallet.id,
    };
    if (this.wallet.wallet_type === 'USDT') {
      obj.miner_fee = this.minerFee;
    }

    this.formSubmitting = true;
    this.httpService.post(obj, 'heaven/create/').subscribe((res?: any) => {
      if (res.status) {
        this.formSubmitting = false;
        this.toastrService.success(this.translate.instant('pages.heaven.toastr.transactionSuccessfullyCompleted'), this.translate.instant('common.heaven'));
        this.getWallets();
        this.heaven_amount = null;
        this.selectedHeavenPlan = null;
        this.changePeriod('SELECT', 'createHeaven');
        this.setAmount('SELECT');
        this.getHeavenHistory();
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(res.message, this.translate.instant('common.heaven'));
      }
    }, (err) => {
      this.formSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }

  getHeavenDrop() {
    this.httpService.get('heaven-drop/').subscribe((res?: any) => {
      this.totalHeavenDropCard.fetchingValue = false;
      this.totalHeavenDropCard.value = res.heaven_drop_total;
      this.totalHeavenDropCard.value_anx = res.heaven_drop_total_anx;
      this.todayHeavenDropCard.fetchingValue = false;
      this.todayHeavenDropCard.value = res.heaven_drop_today;
      this.todayHeavenDropCard.value_anx = res.heaven_drop_today_anx;
    }, (err) => {
      this.totalHeavenDropCard.fetchingValue = false;
      this.todayHeavenDropCard.fetchingValue = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }

  getWallets() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      this.myWallets = _.sortBy(_.filter(res, (item) => {
        item.title = item.wallet_type;
        if (item.wallet_type === 'USDT')
          item.title = 'USDT (OMNI)';
        else if (item.wallet_type === 'ERCUSDT')
          item.title = 'USDT (ERC20)';
        return item.wallet_type !== 'USDT';
      }), 'title');

      if (!this.myWallets) {
        this.walletType = this.translate.instant('common.select');
      } else if (this.shareDataService.transferTitle) {
        this.walletType = this.shareDataService.transferTitle;
        this.wallet = _.find(this.myWallets, ['wallet_type', this.walletType]) || {};
        if (this.wallet) {
          this.maxAmount = ShareDataService.toFixedDown(this.wallet.wallet_amount, 6);
          this.heaven_amount = this.wallet.wallet_amount;
        }
        this.setAmount(this.walletType);
        this.shareDataService.transferTitle = null;
      }
    });
  }

  getHeavenGraph() {
    this.httpService.get('heaven-graph/').subscribe((res) => {
    });
  }

  getANXHistory() {
    this.httpService.get('anx-history/').subscribe((res) => {
    });
  }

  getHeavenReleaseSettings() {
    // this.httpService.get('heaven-release-settings').subscribe((res) => {
    //   console.log('settings', res);
    // });
  }

  getHeavenHistory() {
    jQuery('.heaven-history-spinner').height(jQuery('#heaven-history').height());
    this.fetchHeavenHistory = true;
    this.httpService.get('heaven/history/').subscribe((res?: any) => {
      _.map(res.results, (obj) => {
        obj.title = obj.currency_type;
        if (obj.currency_type === 'USDT')
          obj.title = 'USDT (OMNI)';
        else if (obj.currency_type === 'ERCUSDT')
          obj.title = 'USDT (ERC20)';
      });
      const data = _.orderBy(res.results, ['hid'], ['desc']);
      const heaven_history_data = _.map(data, (obj?: any) => {
        obj.entry_date = moment(obj.entry_date, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.release_date = moment(obj.release_date, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.total_received = ShareDataService.toFixedDown(obj.total_received, 0);
        obj.heaven_amount = ShareDataService.toFixedDown(obj.heaven_amount, 6);
        return obj;
      });
      this.source.load(heaven_history_data);
      this.fetchHeavenHistory = false;
    }, (err) => {
      this.fetchHeavenHistory = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }

  getHeavenDropHistory() {
    jQuery('.heaven-history-spinner').height(jQuery('#heaven-history-Drop').height());
    this.fetchHeavenDropHistory = true;
    this.httpService.get('heaven/bonus-history/').subscribe((res?: any) => {
      _.map(res, (obj) => {
        obj.plan = this.translate.instant('common.heaven') + ' ' + obj.plan;
        obj.title = obj.currency_type;
        if (obj.currency_type === 'USDT')
          obj.title = 'USDT (OMNI)';
        else if (obj.currency_type === 'ERCUSDT')
          obj.title = 'USDT (ERC20)';
      });
      const data = _.orderBy(res, ['created', 'hid'], ['desc']);
      const heaven_drop_history_data = _.map(data, (obj?: any) => {
        obj.created = moment(obj.created, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.amount = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.amount, 6), '1.0-6');
        return obj;
      });
      this.source_heavenDrop.load(_.sortBy(heaven_drop_history_data, ['created']).reverse());
      this.fetchHeavenDropHistory = false;
    }, (err) => {
      this.fetchHeavenDropHistory = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.heaven'));
    });
  }

  ngAfterViewInit() {
    jQuery('ul.downLine li a').click(function (e) {
      jQuery('ul.downLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
