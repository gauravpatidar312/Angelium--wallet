import {Component, AfterViewInit, Input, OnDestroy} from '@angular/core';
import {takeWhile} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {SolarData} from '../../@core/data/solar';
import {HttpService} from '../../services/http.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {ShareDataService} from '../../services/share-data.service';
import {environment} from '../../../environments/environment';
import {ToastrService} from '../../services/toastr.service';

import Swal from 'sweetalert2';
import * as _ from 'lodash';

declare let jQuery: any;

interface CardSettings {
  id: number;
  title: string;
  value: number;
  value_anx: number;
  totalProfitTitle: string;
  total_profit_anx: number;
  iconClass: string;
  type: string;
}

interface CryptoBalance {
  name: string;
  amount: number;
  quantity: number;
  livePrice: number;
}

interface Notification {
  id: number;
  title: String;
  status: string;
  type: string;
  created: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements AfterViewInit, OnDestroy {
  private alive = true;

  isProduction: any = environment.production;
  cryptoBalance: CryptoBalance[] = [];
  cryptoData: any;
  user: any;
  solarValue: number;
  fetchingAssetValue: boolean = false;
  @Input() fetchingCryptos: boolean = false;
  assetCard: CardSettings = {
    id: 1,
    title: this.translate.instant('pages.dashboard.totalAsset'),
    value: 0,
    value_anx: 0,
    totalProfitTitle: '',
    total_profit_anx: 0,
    iconClass: 'fa fa-university',
    type: 'primary',
  };
  gainCard: CardSettings = {
    id: 2,
    title: this.translate.instant('pages.dashboard.profitToday'),
    value: 0,
    value_anx: 0,
    totalProfitTitle: this.translate.instant('pages.dashboard.profitTodayTotal'),
    total_profit_anx: 0,
    iconClass: 'fa fa-chart-line',
    type: 'primary',
  };

  userNotification: Notification[] = [];
  systemNotification: Notification[] = [];

  statusCards: CardSettings[] = [
    this.assetCard,
    this.gainCard,
  ];

  constructor(private solarService: SolarData,
    private httpService: HttpService,
    private sessionStorage: SessionStorageService,
    private shareDataService: ShareDataService,
    public translate: TranslateService,
    private toastrService: ToastrService) {
    this.user = this.sessionStorage.getFromSession('userInfo');

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    this.getNotification();
    this.getAllCryptoBalance();
    this.getTotalinvestmentData();
  }

  ngAfterViewInit() {
      if (this.shareDataService.showNotification) {
        setTimeout(() => {
          this.shareDataService.showNotification = false;
          const el = jQuery('#notifyCalender');
          if (el.length > 0) {
            el[0].scrollIntoView();
          }
        }, 800);
     }
     if (this.sessionStorage.getFromLocalStorage('showUltraHeavenAlert')) {
       this.sessionStorage.removeFromLocalStorage('showUltraHeavenAlert');
       Swal.fire({
         title: this.translate.instant('pages.heaven.ultraHeaven'),
         text: this.translate.instant('pages.heaven.toastr.ultraHeavenStarted'),
         type: 'info',
         showCancelButton: false,
         confirmButtonText: this.translate.instant('swal.ok'),
       });
     }
  }

  getNotification() {
    this.httpService.get('dashboard-notification/').subscribe((data?: any) => {
      if (data.length) {
        this.userNotification = data.filter((notify) => notify.type === 'user')
        .sort((a, b) => new Date(b.schedule_date || b.created).getTime() - new Date(a.date).getTime());
        this.systemNotification = data.filter((notify) => notify.type === 'system')
        .sort((a, b) => new Date(b.schedule_date || b.created).getTime() - new Date(a.date).getTime());
      }
    });
  }

  getAllCryptoBalance() {
    this.fetchingAssetValue = true;
    this.fetchingCryptos = true;
    this.httpService.get('asset/').subscribe((data?: any) => {
      this.assetCard.value = data.total_asset;
      this.gainCard.value = data.total_profit;
      this.gainCard.value_anx = data.today_profit_anx;
      this.gainCard.total_profit_anx = data.total_profit_anx;
      this.fetchingAssetValue = false;
      this.cryptoBalance = _.sortBy(_.filter(data.cryptos, (item) => {
        let decimalPlaces = 6;
        item.title = item.name;
        if (item.name === 'ANX') {
          decimalPlaces = 0;
          item.order = 1;
        } else if (item.name === 'HEAVEN') {
          decimalPlaces = 2;
          item.order = 2;
        } else if (item.name === 'BTC') {
          item.order = 3;
        } else if (item.name === 'ETH') {
          item.order = 4;
        } else if (item.name === 'ANL') {
          item.order = 5;
        } else if (item.name === 'XP') {
          item.order = 6;
        } else if (item.name === 'USDT') {
          item.order = 7;
          item.title = 'USDT (OMNI)';
        } else if (item.name === 'ANLP') {
          item.order = 8;
        } else if (item.name === 'ERCUSDT') {
          item.order = 9;
          item.title = 'USDT (ERC20)';
        }
        item.quantity = ShareDataService.toFixedDown(item.quantity, decimalPlaces);

        let enabled = true;
        if (this.isProduction) {
          if (['ANLP'].indexOf(item.name) >= 0)
            enabled = false;
        }
        return enabled;
      }), 'order');

      this.fetchingCryptos = false;
      this.cryptoData = _.map(this.cryptoBalance, function (obj) {
        const item: any = {};
        item.name = obj.name;
        item.value = obj.amount;
        return item;
      });
      this.getLivePriceData();
    }, (err) => {
      this.fetchingAssetValue = false;
      this.fetchingCryptos = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  getLivePriceData() {
    this.httpService.get('live-price/').subscribe((data?: any) => {
      Object.keys(data).map(key => {
        this.cryptoBalance.map((balance?: any) => {
          if (balance.name === key) {
            balance['livePrice'] = data[key];
          } else if (balance.name === 'HEAVEN') {
            balance['livePrice'] = data.ANX;
          } else if (balance.name === 'ANLP') {
            balance['livePrice'] = data.ANL;
          }
          return balance;
        });
      });
    });
  }

  getTotalinvestmentData() {
    this.httpService.get('total-investment/').subscribe((data?: any) => {
      if (data.hasOwnProperty('investment')) {
        this.gainCard.value = data.investment;
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
