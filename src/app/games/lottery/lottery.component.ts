import {Component, OnInit, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {ShareDataService} from '../../services/share-data.service';
import {Observable} from 'rxjs/Rx';
import * as moment from 'moment';
import * as _ from 'lodash';

declare let jQuery: any;

@Component({
  selector: 'ngx-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss'],
})

export class LotteryComponent implements OnInit, AfterViewInit {
  myWallets: any = [];
  max_winners: any = [];
  currentLotteryData: any;
  walletType: string = 'SELECT';
  selectWallet: any;
  betData: any;
  lotteryData: any;
  winnerData: any;
  smartDetailData: any;
  timerData: any;
  stateDateTimer: any;
  endDateTimer: any;
  isComment: boolean = true;

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
  }

  winnerUsers: { id: number, prizeName: string, XPAmount: string, picture: string, name: string, title: string, message: string }[] = [
    {
      id: 1,
      prizeName: 'ST PRIZE',
      XPAmount: '122000 XP',
      picture: 'CE',
      name: 'RYELU08233',
      title: 'silver angel 12',
      message: 'wish me luck!!'
    },
    {
      id: 2,
      prizeName: 'ND PRIZE',
      XPAmount: '41240 XP',
      picture: 'BK',
      name: 'RYELU08233',
      title: 'silver angel 12',
      message: 'wish me luck!!'
    },
    {
      id: 3,
      prizeName: 'RD PRIZE',
      XPAmount: '12720 XP ',
      picture: 'J',
      name: 'RYELU08233',
      title: 'silver angel 12',
      message: 'wish me luck!!'
    },
  ];

  ngOnInit() {
    this.getCurrentLotteryDetail();
    this.getWallet();
    this.getLotteryList();
  }

  getCurrentLotteryDetail() {
    this.httpService.get('game/get-current-lottery-detail/').subscribe((res?: any) => {
      this.currentLotteryData = res;
      this.setTimer();
      this.getBetList();
      this.getSmartDetail();
      const winnerCounts = _.times(this.currentLotteryData.max_winners, String);
      this.max_winners = _.map(winnerCounts, function (value) {
        return _.sum([Number(value), 1]);
      });
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getWallet() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      this.myWallets = _.sortBy(res, ['wallet_type']);
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getBetList() {
    this.httpService.get(`game/get-bet-list/?lottery_id=${this.currentLotteryData.lottery_id}`).subscribe((res?: any) => {
      this.betData = res;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getLotteryList() {
    this.httpService.get('game/get-lottery-list/').subscribe((res?: any) => {
      this.lotteryData = res.data;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getWinnerList() {
    this.httpService.get('game/get-winner-list/').subscribe((res?: any) => {
      this.winnerData = res.data;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getSmartDetail() {
    this.httpService.get(`game/get-smart-contract-detail/?lottery_id=${this.currentLotteryData.lottery_id}`).subscribe((res?: any) => {
      this.smartDetailData = res;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  onChangeWallet(walletType: string): void {
    this.walletType = walletType;
    if (this.walletType !== 'SELECT') {
      this.selectWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
      if (!this.selectWallet) {
        this.walletType = 'BTC';
        this.selectWallet = this.myWallets.find(item => {
          return item.wallet_type === 'BTC';
        });
      }
    }
  }

  changeBetList(value) {
    this.isComment = value === 'Comment' ? true : false;
  }

  setTimer() {
    const startDate = moment(this.currentLotteryData.start_datetime);
    const endDate = moment(this.currentLotteryData.end_datetime);
    const currentDate = moment();
    if (startDate > currentDate) {
      this.stateDateTimer = startDate;
    } else if (endDate <= currentDate) {
      this.endDateTimer = 'End lottery';
    } else {
      this.timerData = Observable
        .interval(1000)
        .map(() => {
          return endDate.valueOf() - moment().valueOf();
        })
        .map((millis: number) => {
          return moment.duration(millis);
        })
        .publishReplay(1).refCount(); // so that calculation is performed once no matter how many subscribers

      this.timerData.days = this.timerData.map(date => ('0' + date.days()).slice(-2));
      this.timerData.hours = this.timerData.map(date => ('0' + date.hours()).slice(-2));
      this.timerData.minutes = this.timerData.map(date => ('0' + date.minutes()).slice(-2));
      this.timerData.seconds = this.timerData.map(date => ('0' + date.seconds()).slice(-2));
    }
  }

  ngAfterViewInit() {
    jQuery('ul.downLine li a').click(function (e) {
      jQuery('ul.downLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });

    const challengeDiv = jQuery('#betting-body').height() + jQuery('#betting-footer').height() + 70;
    jQuery('#challenges-body').css({height: challengeDiv});
  }
}
