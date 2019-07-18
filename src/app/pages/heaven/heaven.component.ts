import { Component, EventEmitter, OnInit, OnDestroy, AfterViewInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { HttpService } from '../../services/http.service';
import * as _ from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from '../../services/toastr.service';
import { ShareDataService } from '../../services/share-data.service';
import { environment } from 'environments/environment';
import { CustomRendererComponent } from './custom.component';
import { SessionStorageService } from '../../services/session-storage.service';
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
  selector: 'ngx-heaven',
  templateUrl: './heaven.component.html',
  styleUrls: ['./heaven.component.scss'],
})
export class HeavenComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() periodChange = new EventEmitter<string>();
  private alive = true;
  isProduction: any = environment.production;
  user: any;
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
  heaven_amount: any;
  wallet: any;
  maxAmount: number;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;
  days:any;
  fetchHeavenHistory: boolean = false;
  fetchHeavenDropHistory: boolean = false;
  usernameForOTC: any = ['forex711', 'ramy', 'riogrande', 'xwalker', 'xwalker-n', 'mr.angelium'];

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

  constructor(private service: SmartTableData,
              private decimalPipe: DecimalPipe,
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

    this.translate.get('days').subscribe((res: any) => {
      this.days = res;
      console.log(res);
    });
  }

  ngOnInit() {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });

    this.getWallets();
    this.getHeavenDrop();
    this.getHeavenGraph();
    this.getANXHistory();
    this.getHeavenReleaseSettings();
    this.getHeavenHistory('total');
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
      hid: {
        title: this.translate.instant('pages.heaven.heavenId'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      heaven_amount: {
        title: this.translate.instant('common.amount'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width"">${cell}</div>`;
        },
      },
      currency_type: {
        title: this.translate.instant('common.assets'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width"">${cell}</div>`;
        },
      },
      plan: {
        title: this.translate.instant('pages.heaven.plan'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width"">${cell}</div>`;
        },
      },
      total_received: {
        title: this.translate.instant('pages.heaven.received'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width"">${cell} <span class="text-success">ANX</span></div>`;
        },
      },
      entry_date: {
        title: this.translate.instant('pages.heaven.entryDate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      release_date: {
        title: this.translate.instant('pages.heaven.releaseDate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      release_settings: {
        title: this.translate.instant('pages.heaven.releaseSetting'),
        type: 'custom',
        renderComponent: CustomRendererComponent,
        filter: false,
        class: 'heavenhistory-cell text-center td-width',
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
      user_heaven_id: {
        title: this.translate.instant('pages.heaven.heavenId'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      heaven_amount: {
        title: this.translate.instant('common.amount'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell}</div>`;
        },
      },
      currency_type: {
        title: this.translate.instant('common.assets'),
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
      anx_bonus: {
        title: this.translate.instant('pages.heaven.heavenDrop'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans td-width">${cell} <span class="text-success">ANX</span></div>`;
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
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
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
    /*if (this.isProduction && this.wallet.wallet_type === 'USDT' && this.usernameForOTC.indexOf(this.user.username.toLowerCase()) === -1) {
      this.toastrService.info(this.translate.instant('pages.transfer.toastr.featureComingSoonStayTuned'),
        this.translate.instant('common.heaven'));
      return;
    }*/

    if (!this.heaven_amount) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.pleaseEnterAmount'), this.translate.instant('common.heaven'));
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
      this.myWallets = _.sortBy(res, ['wallet_type']);
      /*if (this.isProduction && this.usernameForOTC.indexOf(this.user.username.toLowerCase()) === -1) {
        this.myWallets = _.filter(this.myWallets, (wallet?: any) => {
            return wallet.wallet_type !== 'USDT';
          }) || [];
      }*/

      if (!this.myWallets) {
        this.walletType = this.translate.instant('common.select');
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
    jQuery('.heaven-history-spinner').height(jQuery('#heaven-history').height());
    this.fetchHeavenHistory = true;
    this.httpService.get(`heaven-history/?filter_type=${value}`).subscribe((res?: any) => {
      const data = _.orderBy(res.results, ['hid'], ['desc']);
      const heaven_history_data = _.map(data, (obj?: any) => {
        obj.entry_date = moment(obj.entry_date, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.release_date = moment(obj.release_date, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.total_received = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.total_received, 0), '1.0-0');
        obj.heaven_amount = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.heaven_amount, 6), '1.0-6');
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
    this.httpService.get(`anx-heaven-history/`).subscribe((res?: any) => {
      const data = _.orderBy(res, ['created', 'user_heaven_id'], ['desc']);
      const heaven_drop_history_data = _.map(data, (obj?: any) => {
        obj.created = moment(obj.created, 'DD-MM-YYYY').format('YYYY.MM.DD');
        obj.anx_bonus = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.anx_bonus, 0), '1.0-0');
        obj.heaven_amount = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.heaven_amount, 6), '1.0-6');
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
