import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';
import { HttpService } from '../../services/http.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { ShareDataService } from '../../services/share-data.service';
import {environment} from '../../../environments/environment';
import * as _ from 'lodash';
import {ToastrService} from '../../services/toastr.service';
declare let $: any;

interface CardSettings {
  title: string;
  value: number;
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
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-dashboard.component.scss'],
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements AfterViewInit, OnDestroy {
  private alive = true;

  isProduction: any = environment.production;
  cryptoBalance: CryptoBalance[] = [];
  cryptoData: any;
  user: any;
  solarValue: number;
  currentTheme: string;
  fetchingAssetValue: boolean = false;
  @Input() fetchingCryptos: boolean = false;
  assetCard: CardSettings = {
    title: 'Total Asset',
    value: 0,
    iconClass: 'fa fa-university',
    type: 'primary',
  };
  gainCard: CardSettings = {
    title: 'Profit Today',
    value: 0,
    iconClass: 'fa fa-chart-line',
    type: 'primary',
  };

  statusCards1: string;

  userNotification: Notification[] = [];
  systemNotification: Notification[] = [];

  commonStatusCardsSet: CardSettings[] = [
    this.assetCard,
    this.gainCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.assetCard,
          type: 'primary',
        },
        {
          ...this.gainCard,
          type: 'primary',
        },
      ],
    };

  constructor(private themeService: NbThemeService,
    private solarService: SolarData,
    private httpService: HttpService,
    private sessionStorage: SessionStorageService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService) {
    this.user = this.sessionStorage.getFromSession('userInfo');

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
        this.statusCards1 = this.statusCardsByThemes[theme.name];
      });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    this.getNotification();
    this.getAllCryptoBalance();
    this.getTotalinvestmentData();
  }

  ngAfterViewInit(){
      if (this.shareDataService.showNotification) {
        setTimeout(() => {
          this.shareDataService.showNotification = false;
          let el = $('#notifyCalender');
          if (el.length > 0) {
            el[0].scrollIntoView();
          }
        }, 800);
     }
  }

  getNotification() {
    this.httpService.get('dashboard-notification/').subscribe((data?: any) => {
      if (data.length) {
        this.userNotification = data.filter((notify) => notify.type === 'user')
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.date).getTime());
        this.systemNotification = data.filter((notify) => notify.type === 'system')
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.date).getTime());
      }
    });
  }

  getAllCryptoBalance() {
    this.fetchingAssetValue = true;
    this.fetchingCryptos = true;
    this.httpService.get('asset/').subscribe((data?: any) => {
      this.assetCard.value = data.total_asset;
      this.gainCard.value = data.total_profit;
      this.fetchingAssetValue = false;
      this.cryptoBalance = _.sortBy(_.filter(data.cryptos, (item) => {
        if (item.name === 'ANX')
          item.order = 1;
        else if (item.name === 'HEAVEN')
          item.order = 2;
        else if (item.name === 'BTC')
          item.order = 3;
        else if (item.name === 'ETH')
          item.order = 4;
        else if (item.name === 'ANL')
          item.order = 5;
        else if (item.name === 'XP')
          item.order = 6;
        else if (item.name === 'USDT')
          item.order = 7;
        else if (item.name === 'ANLP')
          item.order = 8;

        return !this.isProduction || ['XP', 'USDT', 'ANLP'].indexOf(item.name) === -1;
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
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
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
    this.httpService.get('total-investment/').subscribe(data => {
      console.log('total-investment', data);
      if (data.hasOwnProperty('investment')) {
        this.gainCard.value = data.investment;
        // console.log('total-investment ', data);
      }
    });
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
