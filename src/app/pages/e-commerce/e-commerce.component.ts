import { Component,OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
interface CardSettings {
  title: string;
  value: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-dashboard.component.scss'],
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnDestroy {

  private alive = true;

  solarValue: number;
  currentTheme: string;
  assetCard: CardSettings = {
    title: 'Total Assets',
    value: '572,900',
    iconClass: 'fa fa-university',
    type: 'primary',
  };
  gainCard: CardSettings = {
    title: 'Total Gain',
    value: '572,900',
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
              private solarService: SolarData) {
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
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
