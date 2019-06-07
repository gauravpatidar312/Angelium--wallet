import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';
import { HttpService } from '../../services/http.service';
import { SessionStorageService } from '../../services/session-storage.service';
interface CardSettings {
  title: string;
  value: number;
  iconClass: string;
  type: string;
}

interface CryptoBalance {
  type: string;
  amount: number;
  quantity: number;
  livePrice: number;
}

@Component({
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-dashboard.component.scss'],
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnDestroy {
  private alive = true;

  cryptoBalance: CryptoBalance[] = [];
  user: any;
  solarValue: number;
  currentTheme: string;
  assetCard: CardSettings = {
    title: 'Total Assets',
    value: 0,
    iconClass: 'fa fa-university',
    type: 'primary',
  };
  gainCard: CardSettings = {
    title: 'Total Gain',
    value: 0,
    iconClass: 'fa fa-chart-line',
    type: 'primary',
  };

  statusCards1: string;

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
    private sessionStorage: SessionStorageService) {
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
    this.getAssetsData();
    this.getTotalinvestmentData();
  }

  getNotification() {
    this.httpService.get('dashboard-notification/').subscribe(data => {
      console.log('Notify ', data);
    });
  }

  getAllCryptoBalance() {
    this.httpService.get('all-crypto-balance/').subscribe(data => {
      this.cryptoBalance = data;
      this.getlivepriceData();
    });
  }

  getlivepriceData() {
    this.httpService.get('live-price/').subscribe(data => {
      Object.keys(data).map(key => {
        this.cryptoBalance = this.cryptoBalance.map((balance) => {
          if (balance.type === key) {
            balance['livePrice'] = data[key];
          }
          return balance;
        });
      });
      console.log('cryptoBalance with live price', this.cryptoBalance);
    });
  }

  getAssetsData() {
    this.httpService.get('my-assets/').subscribe(data => {
      console.log('Assets ', data);
    });
  }

  getTotalinvestmentData() {
    this.httpService.get('total-investment/').subscribe(data => {
      if (data.hasOwnProperty('investment')) {
        this.gainCard.value = data.investment;
        console.log('total-investment ', data);
      }
    });
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
