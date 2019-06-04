import { Component, OnInit } from '@angular/core';
import { SmartTableData } from '../../@core/data/smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
// import { animate, state, style, transition, trigger } from '@angular/animations';
interface CardSettings {
  title: string;
  value: string;
  iconClass: string;
  type: string;
}

export interface downlineElement {
  username: string;
  level: number;
  rank: number;
  heaven: number;
  yourreward: number;
  symbol: string;
}

@Component({
  selector: 'ngx-angel',
  templateUrl: './angel.component.html',
  styleUrls: ['./angel.component.scss']
})
export class AngelComponent implements OnInit {

  private alive = true;
  currentTheme: string;
  source: LocalDataSource = new LocalDataSource();
  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
    },
    columns: {
      id: {
        title: 'Level',
        type: 'number',
        filter: false
      },
      firstName: {
        type: 'html',
        title: 'Your Reward',
        class: 'table-col',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      lastName: {
        title: 'Reward Rate',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      username: {
        title: 'Downline Rate',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      email: {
        title: 'Heaven',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      age: {
        title: 'Downline',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
    },
  };
  settingsnew = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
    },
    columns: {
      id: {
        title: 'Level',
        type: 'number',
        filter: false
      },
      firstName: {
        title: 'Username',
        type: 'html',
        class: 'table-col',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      lastName: {
        title: 'Rank',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      username: {
        title: 'Heaven',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      email: {
        title: 'Reward',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      age: {
        title: 'Your Reward',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
    },
  };

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

  commonStatusCardsSet: CardSettings[] = [
    this.assetCard,
    this.gainCard,
  ];
  statusCards1: string;

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

    downlineData: downlineElement[] = [
      { level: 1, username: 'Rio', rank: 131, heaven: 131, yourreward: 131, symbol: 'Rio' },
      { level: 2, username: 'Py', rank: 132, heaven: 131, yourreward: 131,symbol: 'He' },
      { level: 3, username: 'Shrikant', rank: 131, heaven: 131, yourreward: 131, symbol: 'Li' },
      { level: 1, username: 'Fluorine', rank: 131, heaven: 131, yourreward: 131, symbol: 'F' },
      { level: 1, username: 'Neon', rank: 131, heaven: 131, yourreward: 131, symbol: 'Ne' }
    ];

  constructor(private service: SmartTableData,
    private themeService: NbThemeService) {
    const data = this.service.getData();
    const NewOBj = [];
    for (let x = 0; x < 10; x++) {
      NewOBj.push(data[x])
    }
    this.source.load(NewOBj);
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
        this.statusCards1 = this.statusCardsByThemes[theme.name];
      });
  }

  ngOnInit() {
  }

}
