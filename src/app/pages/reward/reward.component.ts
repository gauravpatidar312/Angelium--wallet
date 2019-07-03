import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {SmartTableData} from '../../@core/data/smart-table';
import {LocalDataSource} from 'ng2-smart-table';
import { TranslateService } from "@ngx-translate/core";
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';
import {NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder} from '@nebular/theme';

import {HttpService} from '../../services/http.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {environment} from '../../../environments/environment';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';

declare var $: any

interface CardSettings {
  title: string;
  value: string;
  percentage: string;
  iconClass: string;
  type: string;
}

export interface yourrewardElement {
  level: number;
  yourreward: number;
  rewardrate: string;
  downlinereward: number;
  heaven: number;
  downline: number;
}

export interface downlineElement {
  level: number;
  username: string;
  rank: number;
  heaven: number;
  reward: number;
  your_reward: number;
  referral_users: any;
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  arrow: boolean;
  heaven: number;
  level: number;
  username: string;
  rank: number;
  reward: number;
  your_reward: number;
  referral_users: any;
}

@Component({
  selector: 'ngx-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent implements OnInit, AfterViewInit {

  allColumns = ['level', 'username', 'rank', 'heaven', 'reward', 'rate', 'your_reward'];
  noDataSource: boolean = true;
  dataSource: TreeNode<FSEntry>[] = [];

  private alive = true;
  isProduction: any = environment.production;
  currentTheme: string;
  fetchingRewardValue: boolean = false;
  fetchingDownlineTree: boolean = false;
  fetchingDownlineHeaven: boolean = false;
  fetchingDownlineAngel: boolean = false;
  source: LocalDataSource = new LocalDataSource();

  rewardData: yourrewardElement[] = [
    {level: 1, yourreward: 131131, rewardrate: '100%', downlinereward: 131, heaven: 131, downline: 14},
    {level: 2, yourreward: 131131, rewardrate: '10%', downlinereward: 131, heaven: 131, downline: 14},
    {level: 3, yourreward: 131131, rewardrate: '10%', downlinereward: 131, heaven: 131, downline: 14},
    {level: 4, yourreward: 131131, rewardrate: '10%', downlinereward: 131, heaven: 131, downline: 14},
    {level: 5, yourreward: 131131, rewardrate: '10%', downlinereward: 131, heaven: 131, downline: 14},
    {level: 6, yourreward: 131131, rewardrate: '10%', downlinereward: 131, heaven: 131, downline: 14},
  ];

  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
    },
    columns: {
      level: {
        title: this.translate.instant('common.level'),
        type: 'number',
        filter: false
      },
      yourreward: {
        type: 'html',
        title: this.translate.instant('pages.reward.downlineTree.your_reward'),
        class: 'table-col',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      rewardrate: {
        title: this.translate.instant('pages.reward.downlineTree.reward')+' '+ this.translate.instant('common.rate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      downlinereward: {
        title: this.translate.instant('common.downline')+" "+ this.translate.instant('common.rate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      heaven: {
        title: this.translate.instant('common.heaven'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      downline: {
        title: this.translate.instant('common.downline'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
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

  totalRewardCard: CardSettings = {
    title: this.translate.instant('pages.reward.totalReward'),
    value: '0',
    percentage: '0',
    iconClass: 'nb-home',
    type: 'primary',
  };
  todayRewadCard: CardSettings = {
    title: this.translate.instant('pages.reward.rewardToday'),
    value: '0',
    percentage: '0',
    iconClass: 'nb-roller-shades',
    type: 'primary',
  };

  commonStatusCardsSet: CardSettings[] = [
    this.totalRewardCard,
    this.todayRewadCard,
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
        ...this.totalRewardCard,
        type: 'primary',
      },
      {
        ...this.todayRewadCard,
        type: 'primary',
      },
    ],
  };

  downlineData: downlineElement[];

  userData: any;
  angel_count: any;
  downline_heaven: any;
  total_users: any;
  constructor(private service: SmartTableData,
              private themeService: NbThemeService,
              private httpService: HttpService,
              private sanitizer: DomSanitizer,
              private sessionStorage: SessionStorageService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              public translate: TranslateService) {

    this.userData = this.sessionStorage.getFromSession('userInfo');
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
        console.log(this.statusCards1)
      });
    this.getDownlineTree('total');
    this.getDownlinecount();
    this.getReward();
    this.getDownlineAngel();
    this.getDownlineHeaven();
  }

  getReward() {
    this.fetchingRewardValue = true;
    let url = `reward/`;
    this.httpService.get(url).subscribe((res?: any) => {
      if (res.total) {
        this.totalRewardCard.value = res.total.reward;
        this.totalRewardCard.percentage = res.total.percentage;
      }
      if (res.daily) {
        this.todayRewadCard.value = res.daily.reward;
        this.todayRewadCard.percentage = res.total.percentage;
      }
      this.fetchingRewardValue = false;
    }, (err) => {
      this.fetchingRewardValue = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), 
        this.translate.instant('common.reward'));
    });
  }

  getDownlineAngel() {
    this.fetchingDownlineAngel = true;
    this.httpService.get(`downline-angel/`).subscribe((res?: any) => {
        this.angel_count = res.angel_count;
      this.fetchingDownlineAngel = false;
    }, (err) => {
      this.fetchingDownlineAngel = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.reward'));
    });
  }

  getDownlineHeaven() {
    this.fetchingDownlineHeaven = true;
    this.httpService.get(`downline-heaven/`).subscribe((res?: any) => {
      this.downline_heaven = res.downline_heaven.toFixed(2);
      this.total_users = res.total_users;
      this.fetchingDownlineHeaven = false;
    }, (err) => {
      this.fetchingDownlineHeaven = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.reward'));
    });
  }

  getDownlinecount() {
    let url = `downline_count/`;
    this.httpService.get(url).subscribe(res => {
      // console.log('downline count', res);
    });
  }

  getDownlineTree(val) {
    $('.downline-tree-spinner').height($('#downline-tree').height());
    this.fetchingDownlineTree = true;
    const value = val;
    const url = `downline_tree/?filter_type=${value}`;
    this.httpService.get(url).subscribe((res?: any) => {
      this.dataSource = res;
      if (res.length !== 0)
        this.noDataSource = true;
      else
        this.noDataSource = false;
      this.fetchingDownlineTree = false;
    }, (err) => {
      this.fetchingDownlineTree = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.reward'));
    });
  }

  getArray(number) {
    return new Array(number).fill('');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('ul.rewardLine li a').click(function (e) {
      $('ul.rewardLine li.active').removeClass('active');
      $(this).parent('li').addClass('active');
    });
    $('ul.downLine li a').click(function (e) {
      $('ul.downLine li.active').removeClass('active');
      $(this).parent('li').addClass('active');
    });
  }
}
