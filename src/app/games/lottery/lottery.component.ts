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
  estimatedWinners: any = [];
  currentLotteryData: any;
  walletType: string = 'SELECT';
  selectWallet: any;
  selectedLottery: any;
  noWinnerListText: string;
  betNotAvailable: string;
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
  fetchingWinner: boolean = false;
  fetchingBetList: boolean = false;
  setDefaultBetNumber: boolean = false;

  constructor(private httpService: HttpService,
              private http: HttpClient,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.getCurrentLotteryDetail();
    this.getWallet();
    this.getLotteryList();
    this.getSmartContract();
    Observable.interval(15000).takeWhile(() => true).subscribe(() => {
      this.getPrizeList();
      this.getBetList();
    });
  }

  onRefreshButton() {
    this.getPrizeList();
    this.getBetList();
  }

  getCurrentLotteryDetail() {
    this.httpService.get('game/get-current-lottery-detail/').subscribe((res?: any) => {
      this.currentLotteryData = res;
      this.selectedLottery = this.currentLotteryData;
      this.setTimer();
      this.getBetList();
      this.getWinnerList(this.currentLotteryData.lottery_id);
      this.getPrizeList();
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getWallet() {
    this.httpService.get('asset/').subscribe((data?: any) => {
      const cryptosData = _.filter(data.cryptos, (crypto?: any) => {
        return !(crypto.name === 'ANL' || crypto.name === 'HEAVEN' || crypto.name === 'ANLP' || crypto.name === 'ERCUSDT');
      });
      const walletData = _.map(cryptosData, function (obj?: any) {
        const item: any = {};
        item.title = obj.name;
        item.wallet_type = obj.name;
        item.wallet_amount = obj.quantity;
        if (item.wallet_type === 'USDT')
            item.title = 'USDT (OMNI)';
        return item;
      });
      this.myWallets = _.sortBy(walletData, ['title']);
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getBetList() {
    this.fetchingBetList = true;
    this.httpService.get(`game/get-bet-list/?lottery_id=${this.currentLotteryData.lottery_id}`).subscribe((res?: any) => {
      this.betData = _.map(res, (data) => {
        if (data.level === 1)
          data.level = _.lowerCase(this.translate.instant('pages.setting.silverAngel'));
        else if (data.level === 2)
          data.level = _.lowerCase(this.translate.instant('pages.setting.goldAngel'));
        else if (data.level === 3)
          data.level = _.lowerCase(this.translate.instant('pages.setting.pinkAngel'));
        else
          data.level = _.lowerCase(this.translate.instant('pages.setting.angel'));
        return data;
      });

      if (!this.betData.length)
          this.betNotAvailable = this.translate.instant('games.lottery.betNotAvailable');
      this.fetchingBetList = false;
    }, (err) => {
      this.fetchingBetList = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getPrizeList() {
    this.httpService.get(`game/get-estimated-prize-list/?lottery_id=${this.currentLotteryData.lottery_id}`).subscribe((res?: any) => {
      this.estimatedWinners = _.map(res, (winner) => {
        if (winner.winner_rank === 1)
          winner.prizeText = this.translate.instant('games.lottery.stPrize');
        else if (winner.winner_rank === 2)
          winner.prizeText = this.translate.instant('games.lottery.ndPrize');
        else if (winner.winner_rank === 3)
          winner.prizeText = this.translate.instant('games.lottery.rdPrize');
        else
          winner.prizeText = this.translate.instant('games.lottery.thPrize');

        if (winner.level === 1)
          winner.level = _.lowerCase(this.translate.instant('pages.setting.silverAngel'));
        else if (winner.level === 2)
          winner.level = _.lowerCase(this.translate.instant('pages.setting.goldAngel'));
        else if (winner.level === 3)
          winner.level = _.lowerCase(this.translate.instant('pages.setting.pinkAngel'));
        else
          winner.level = _.lowerCase(this.translate.instant('pages.setting.angel'));
        return winner;
      });
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getLotteryList() {
    this.httpService.get('game/get-lottery-list/').subscribe((res?: any) => {
      this.lotteryData = res;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  getWinnerList(value) {
    jQuery('.spinner-width').height(jQuery('#winnerList').height());
    this.fetchingWinner = true;
    this.httpService.get(`game/get-winners-list/?lottery_id=${value}`).subscribe((res?: any) => {
      this.winnerData = _.map(res, (winner) => {
        if (winner.winner_rank === 1)
          winner.prizeText = this.translate.instant('games.lottery.stPrize');
        else if (winner.winner_rank === 2)
          winner.prizeText = this.translate.instant('games.lottery.ndPrize');
        else if (winner.winner_rank === 3)
          winner.prizeText = this.translate.instant('games.lottery.rdPrize');
        else
          winner.prizeText = this.translate.instant('games.lottery.thPrize');

        if (winner.level === 1)
          winner.level = _.lowerCase(this.translate.instant('pages.setting.silverAngel'));
        else if (winner.level === 2)
          winner.level = _.lowerCase(this.translate.instant('pages.setting.goldAngel'));
        else if (winner.level === 3)
          winner.level = _.lowerCase(this.translate.instant('pages.setting.pinkAngel'));
        else
          winner.level = _.lowerCase(this.translate.instant('pages.setting.angel'));
        return winner;
      });

      if (!this.winnerData.length) {
        if (this.currentLotteryData.lottery_id === this.selectedLottery.lottery_id) {
          const lotteryDetails = _.orderBy(this.lotteryData, ['end_datetime'], ['desc']);
          if (lotteryDetails.length > 1) {
            this.onChangeLottery(lotteryDetails[1]);
          } else
            this.noWinnerListText = this.translate.instant('games.lottery.toastr.noDataFoundCurrentLottery');
        } else
          this.noWinnerListText = this.translate.instant('games.lottery.toastr.noDataFoundWinnerList');
      }
      this.fetchingWinner = false;
    }, (err) => {
      this.fetchingWinner = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  onChangeLottery(lottery: string): void {
    this.selectedLottery = lottery;
    this.getWinnerList(this.selectedLottery.lottery_id);
  }

  onChangeWallet(walletType: string): void {
    const walletObject: any = _.find(this.myWallets, ['wallet_type', walletType]);
    this.walletType = walletObject.title;
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

    this.setDefaultBetNumber = Number(this.currentLotteryData.bet_amount) <= 0;
    if (this.setDefaultBetNumber)
      this.placeLottery.bet_number = 1;
    this.calculateAmount();
  }

  getSmartContract() {
    this.http.get('assets/smart-contract.cpp', {responseType: 'text'}).subscribe((data?: any) => {
      this.smartContract = data;
    });
  }

  onPlaceLottery() {
    if (!(this.selectWallet && this.selectWallet.wallet_type)) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.selectWalletType'), this.translate.instant('common.lottery'));
      return;
    }

    if (!this.placeLottery.bet_number) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.betAmountMessage'), this.translate.instant('common.lottery'));
      return;
    }

    if (Number(this.placeLottery.bet_number) > Number(this.currentLotteryData.max_bet)) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.betLimitExceed', {'maxBet': this.currentLotteryData.max_bet}),
        this.translate.instant('common.lottery'));
      return;
    }

    if (Number(this.totalBetAmount) > Number(this.selectWallet.wallet_amount)) {
      this.toastrService.danger(this.translate.instant('games.lottery.toastr.betAmountExceed'),
        this.translate.instant('common.lottery'));
      return;
    }

    const placeLotteryData = {
      'lottery_id': this.currentLotteryData.lottery_id,
      'bet_number': this.placeLottery.bet_number,
      'currency_type': this.selectWallet.wallet_type,
      'comment': this.placeLottery.comment || '',
      'winning_comment': this.placeLottery.winning_comment || ''
    };

    this.formSubmitting = true;
    this.httpService.post(placeLotteryData, 'game/place-lottery-bet/').subscribe((res?: any) => {
      if (res.status) {
        this.formSubmitting = false;
        this.getBetList();
        this.getWinnerList(this.currentLotteryData.lottery_id);
        this.getPrizeList();
        this.toastrService.success(this.translate.instant('games.lottery.toastr.bettingSuccessfullyCompleted'), this.translate.instant('common.lottery'));
      }
    }, (err) => {
      this.formSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.lottery'));
    });
  }

  calculateAmount() {
    if (!this.placeLottery.bet_number) {
      this.totalBetAmount = '';
      return;
    }
    this.fetchingAmount = true;
    this.httpService.get(`game/get-currency-calculation/?lottery_id=${this.currentLotteryData.lottery_id}&bet_number=${this.placeLottery.bet_number}&currency=${this.selectWallet.wallet_type}`).subscribe((res?: any) => {
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
      this.currentLotteryData.status = 'upcoming';
      this.stateDate = moment(startDate).format('YYYY.MM.DD HH:mm:ss');
    } else if (endDate <= currentDate) {
      this.currentLotteryData.status = 'past';
      this.lotteryDate = 'Lottery finished';
    } else {
      this.currentLotteryData.status = 'running';
      this.timerData = Observable
        .interval(1000)
        .map(() => {
          const value: number = endDate.valueOf() - moment().valueOf();
          if (value <= 0)
            return document.location.reload(true);
          else
            return value;
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

    if (this.currentLotteryData.status === 'running') {
      const challengeDiv = jQuery('#betting-body').height() + jQuery('#betting-footer').height() + 70 - 17;
      jQuery('#challenges-body').css({height: challengeDiv});
      jQuery('#challenges-body').css({maxHeight: challengeDiv});
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
