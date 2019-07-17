import {Component, OnInit,  AfterViewInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {LocalDataSource} from 'ng2-smart-table';
import {TranslateService} from '@ngx-translate/core';
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';

import {HttpService} from '../../services/http.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {environment} from '../../../environments/environment';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';

import * as moment from 'moment';
import * as _ from 'lodash';

declare let jQuery: any;

interface CardSettings {
  title: string;
  value: number;
  value_anx: number;
  iconClass: string;
  type: string;
}

export interface rewardElement {
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
  styleUrls: ['./reward.component.scss'],
})
export class RewardComponent implements OnInit, AfterViewInit {

  allColumns = ['level', 'username', 'rank', 'heaven', 'reward', 'rate', 'your_reward'];
  noDataSource: boolean = false;
  dataSource: TreeNode<FSEntry>[] = [];

  private alive = true;
  isProduction: any = environment.production;
  currentTheme: string;
  fetchingRewardValue: boolean = false;
  fetchingDownlineTree: boolean = false;
  fetchingDownlineHeaven: boolean = false;
  fetchingDownlineAngel: boolean = false;
  fetchingHistory: boolean = false;

  rewardData: rewardElement[] = [
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
        title: this.translate.instant('pages.reward.downlineTree.reward') + ' ' + this.translate.instant('common.rate'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
        },
      },
      downlinereward: {
        title: this.translate.instant('common.downline') + ' ' + this.translate.instant('common.rate'),
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

  reward_history = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: true,
    },
    mode: 'inline',
    editable: false,
    noDataMessage: this.translate.instant('pages.reward.noDataFound'),
    columns: {
      date: {
        title: this.translate.instant('common.date'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss downlineTree">${cell}</div>`;
        },
      },
      anx_quantity: {
        title: this.translate.instant('pages.reward.downlineTree.reward'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="rewardtblcss downlineTree">${cell} <span class="text-success">ANX</span></div>`;
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  totalRewardCard: CardSettings = {
    title: this.translate.instant('pages.reward.totalReward'),
    value: 0,
    value_anx: 0,
    iconClass: 'nb-home',
    type: 'primary',
  };
  todayRewardCard: CardSettings = {
    title: this.translate.instant('pages.reward.rewardToday'),
    value: 0,
    value_anx: 0,
    iconClass: 'nb-roller-shades',
    type: 'primary',
  };

  commonStatusCardsSet: CardSettings[] = [
    this.totalRewardCard,
    this.todayRewardCard,
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
        ...this.todayRewardCard,
        type: 'primary',
      },
    ],
  };

  downlineData: downlineElement[];

  userData: any;
  angel_count: any;
  downline_heaven: any;
  total_users: any;

  constructor(private themeService: NbThemeService,
              private decimalPipe: DecimalPipe,
              private httpService: HttpService,
              private sessionStorage: SessionStorageService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              public translate: TranslateService) {
    this.userData = this.sessionStorage.getFromSession('userInfo');
    if (this.userData.infinity_mark === 1)
      this.userData.infinity_name = 'SILVER ANGEL';
    else if (this.userData.infinity_mark === 2)
      this.userData.infinity_name = 'GOLD ANGEL';
    else if (this.userData.infinity_mark === 3)
      this.userData.infinity_name = 'PINK ANGEL';
    else
      this.userData.infinity_name = 'ANGEL';
    /* const data = this.service.getData();
     const NewOBj = [];
     for (let x = 0; x < 10; x++) {
     NewOBj.push(data[x]);
     }
     this.source.load(NewOBj);*/
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
    this.getRewardHistory();
  }

  getReward() {
    this.fetchingRewardValue = true;
    this.httpService.get(`reward/`).subscribe((res?: any) => {
      if (res.total) {
        this.totalRewardCard.value = res.total.reward;
        this.totalRewardCard.value_anx = res.total.reward_anx;
      }
      if (res.daily) {
        this.todayRewardCard.value = res.daily.reward;
        this.todayRewardCard.value_anx = res.daily.reward_anx;
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
    jQuery('.downline-tree-spinner').height(jQuery('#downline-tree').height());
    this.fetchingDownlineTree = true;
    const url = `downline_tree/?filter_type=${val}`;
    this.httpService.get(url).subscribe((res?: any) => {
      this.dataSource = res;
      this.noDataSource = !!res.length;
      this.fetchingDownlineTree = false;
    }, (err) => {
      this.fetchingDownlineTree = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.reward'));
    });
  }

  getRewardHistory() {
    jQuery('.reward-history-spinner').height(jQuery('#reward-history').height());
    this.fetchingHistory = true;
    this.httpService.get(`reward-history/`).subscribe((res?: any) => {
      const history_data = _.map(res, (obj?: any) => {
        obj.date = moment(obj.date, 'YYYY-MM-DD').format('YYYY.MM.DD');
        obj.anx_quantity = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.anx_quantity, 0), '1.0-0');
        return obj;
      });
      this.source.load(_.sortBy(history_data, ['date']).reverse());
      this.fetchingHistory = false;
    }, (err) => {
      this.fetchingHistory = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.reward'));
    });
  }

  getArray(number) {
    return new Array(number).fill('');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('ul.rewardLine li a').click(function (e) {
      jQuery('ul.rewardLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
    jQuery('ul.downLine li a').click(function (e) {
      jQuery('ul.downLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }
}
