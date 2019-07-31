import {Component, OnInit, AfterViewInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
  totalBetAmount: any;
  lotteryData: any;
  winnerData: any;
  smartContract: any;
  timerData: any;
  stateDate: any;
  lotteryDate: any;
  isComment: boolean = true;
  placeLottery: any = [];
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;

  constructor(private httpService: HttpService,
              private http: HttpClient,
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
    this.getSmartContract();
  }

  getCurrentLotteryDetail() {
    this.httpService.get('game/get-current-lottery-detail/').subscribe((res?: any) => {
      this.currentLotteryData = res;
      this.setTimer();
      this.getBetList();
      this.getWinnerList();
      const winnerCounts = _.times(this.currentLotteryData.max_winners, String);
      const self = this;
      this.max_winners = _.map(winnerCounts, function (value) {
        const obj: any = {};
        obj.winnerId = Number(value) + 1;
        if (obj.winnerId === 1)
          obj.prizeText = self.translate.instant('games.lottery.stPrize');
        else if (obj.winnerId === 2)
          obj.prizeText = self.translate.instant('games.lottery.ndPrize');
        else if (obj.winnerId === 3)
          obj.prizeText = self.translate.instant('games.lottery.rdPrize');
        else
          obj.prizeText = self.translate.instant('games.lottery.thPrize');
        return obj;
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
    this.httpService.get(`game/get-lottery-winner-list/?lottery_id=${this.currentLotteryData.lottery_id}`).subscribe((res?: any) => {
      this.winnerData = _.map(res, (winner) => {
        if (winner.winner_rank === 1)
          winner.prizeText = this.translate.instant('games.lottery.stPrize');
        else if (winner.winner_rank === 2)
          winner.prizeText = this.translate.instant('games.lottery.ndPrize');
        else if (winner.winner_rank === 3)
          winner.prizeText = this.translate.instant('games.lottery.rdPrize');
        else
          winner.prizeText = this.translate.instant('games.lottery.thPrize');
        return winner;
      });
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  onChangeWallet(walletType: string): void {
    this.walletType = walletType;
    this.setAmount(this.placeLottery.bet_amount);
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

  getSmartContract() {
    this.http.get('assets/smart-contract.cpp', { responseType: 'text' }).subscribe((data?: any) => {
      this.smartContract = data;
    });
  }

  changeBetList(value) {
    this.isComment = value === 'Comment' ? true : false;
  }

  onPlaceLottery() {
    if (!(this.selectWallet && this.selectWallet.wallet_type)) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.selectWalletType'), this.translate.instant('common.lottery'));
      return;
    }

    if (!this.placeLottery.bet_amount) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.betAmountMessage'), this.translate.instant('common.lottery'));
      return;
    }

    if (Number(this.placeLottery.bet_amount) > Number(this.currentLotteryData.max_bet)) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.youDontHaveSufficientBetToTotalBets'),
        this.translate.instant('common.lottery'));
      return;
    }

    if (Number(this.totalBetAmount) > Number(this.selectWallet.wallet_amount)) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.youDontHaveSufficientBalanceToBetting'),
        this.translate.instant('common.lottery'));
      return;
    }

    const placeLotteryData = {
      'lottery_id': this.currentLotteryData.lottery_id,
      'bet_amount': this.placeLottery.bet_amount,
      'user_wallet': this.selectWallet.id,
      'comment': this.placeLottery.comment || '',
      'winning_comment': this.placeLottery.winning_comment || ''
    };

    this.formSubmitting = true;
    this.httpService.post(placeLotteryData, 'game/place-lottery-bet/').subscribe((res?: any) => {
      if (res.data) {
        this.formSubmitting = false;
        this.getBetList();
        this.getWinnerList();
        this.toastrService.success(this.translate.instant('games.lottery.toastr.bettingSuccessfullyCompleted'), this.translate.instant('common.lottery'));
      }
    }, (err) => {
      this.formSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  setAmount(value) {
    if (!value) {
      this.totalBetAmount = '';
      return;
    }
    this.fetchingAmount = true;
    this.httpService.get(`game/get-currency-calculation/?lottery_id=${this.currentLotteryData.lottery_id}&bet_amount=${this.placeLottery.bet_amount}&currency=${this.selectWallet.wallet_type}`).subscribe((res?: any) => {
      this.fetchingAmount = false;
      this.totalBetAmount = res.amount;
    }, (err) => {
      this.fetchingAmount = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  setTimer() {
    const startDate = moment(this.currentLotteryData.start_datetime);
    const endDate = moment(this.currentLotteryData.end_datetime);
    const currentDate = moment();
    if (startDate > currentDate) {
      this.stateDate = moment(startDate).format('YYYY.MM.DD HH:mm:ss');
    } else if (endDate <= currentDate) {
      this.lotteryDate = 'Lottery finished';
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
    jQuery('#challenges-body').css({maxHeight: challengeDiv});
  }
}
