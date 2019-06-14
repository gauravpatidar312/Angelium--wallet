import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SmartTableData } from '../../@core/data/smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';

declare let $ : any
interface CardSettings {
  title: string;
  value: string;
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

@Component({
  selector: 'ngx-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent implements OnInit, AfterViewInit {
    private alive = true;
    currentTheme: string;
    source: LocalDataSource = new LocalDataSource();

    rewardData: yourrewardElement[] = [
      { level: 1, yourreward: 131131, rewardrate: '100%', downlinereward: 131,  heaven: 131, downline: 14 },
      { level: 2, yourreward: 131131, rewardrate: '10%', downlinereward: 131,  heaven: 131, downline: 14 },
      { level: 3, yourreward: 131131, rewardrate: '10%', downlinereward: 131,  heaven: 131, downline: 14 },
      { level: 4, yourreward: 131131, rewardrate: '10%', downlinereward: 131,  heaven: 131, downline: 14 },
      { level: 5, yourreward: 131131, rewardrate: '10%', downlinereward: 131,  heaven: 131, downline: 14 },
      { level: 6, yourreward: 131131, rewardrate: '10%', downlinereward: 131,  heaven: 131, downline: 14 },
    ];

    settings = {
      hideSubHeader: true,
      actions: false,
      pager: {
        display: false,
      },
      columns: {
        level: {
          title: 'Level',
          type: 'number',
          filter: false
        },
        yourreward: {
          type: 'html',
          title: 'Your Reward',
          class: 'table-col',
          filter: false,
          valuePrepareFunction: (cell, row) => {
            return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
          },
        },
        rewardrate: {
          title: 'Reward Rate',
          type: 'html',
          filter: false,
          valuePrepareFunction: (cell, row) => {
            return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
          },
        },
        downlinereward: {
          title: 'Downline Rate',
          type: 'html',
          filter: false,
          valuePrepareFunction: (cell, row) => {
            return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
          },
        },
        heaven: {
          title: 'Heaven',
          type: 'html',
          filter: false,
          valuePrepareFunction: (cell, row) => {
            return `<div class="rewardtblcss"> <span class="">${cell} </span><span class="delta up">4%</span></div>`;
          },
        },
        downline: {
          title: 'Downline',
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

    downlineData: downlineElement[];

  constructor(private service: SmartTableData,
    private themeService: NbThemeService,
    private httpService: HttpService,
    private sanitizer: DomSanitizer) {
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

      this.getDownlineTree('today');
  }

  getDownlineTree(val){
    let value = val;
    let url = `downline_tree/?filter_type=${value}`;
    this.httpService.get(url).subscribe(res=>{
      this.downlineData = [];
      this.downlineData = res.data;
      console.log(this.downlineData);
    });
  }

  getArray(number) {
    return new Array(number).fill('');
  }

  ngOnInit() {}

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