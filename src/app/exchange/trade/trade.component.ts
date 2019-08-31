import {Component, OnInit, AfterViewInit, TemplateRef} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NbMediaBreakpoint, NbDialogService} from '@nebular/theme';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ShareDataService} from '../../services/share-data.service';

import * as _ from 'lodash';
declare let jQuery: any;

@Component({
  selector: 'ngx-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})

export class TradeComponent implements OnInit, AfterViewInit {
  @Output() messageEvent = new EventEmitter<any>();
  formSubmittingSell: boolean = false;
  formSubmittingBuy: boolean = false;
  breakpoints: any;
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  exchangeWallets: any = [];
  myWallets = [];
  depositAmount: number;
  withdrawAmount: number;
  selectWalletData: any = {};
  seletedCryptoDepositData: any = {};
  cryptoDepositType: string = this.translate.instant('common.select');
  withdrawWalletType: string = this.translate.instant('common.select');
  submitWithdrawDisable: boolean = false;
  submitDepositDisable: boolean = false;
  depositPopupAmount: number = 0;
  withdrawWalletAmount: number = 0;
  fetchingSellAmount: boolean = false;
  sellWalletDollar: number = 0;
  fetchingSellTotalAmount: boolean = false;
  sellTotalWalletDollar: number = 0;
  fetchingAmount: boolean = false;
  fetchingWithdrawAmount: boolean = false;
  fetchingBuyAmount: boolean = false;
  buyWalletDollar: number = 0;
  fetchingBuyTotalAmount: boolean = false;
  buyTotalWalletDollar: number = 0;
  availableWalletType: any;
  availableBalance: any;
  tradeTab: string = 'buy';
  tradeBuy: any = {};
  tradeSell: any = {};

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              public shareDataService: ShareDataService,
              public translate: TranslateService,
              private dialogService: NbDialogService) {}

  ngOnInit() {}

  parentData(data: any) {
    if (data) {
      // tradeBuy
      if (this.shareDataService.showSpinnerForExchange) {
        this.tradeBuy.from = data.from;
        this.tradeBuy.to = data.to;
        this.tradeBuy.pair = data.pair;
        this.tradeBuy.amount = 0;
        this.tradeBuy.price = 0;
        this.buyWalletDollar = 0;
        this.buyTotalWalletDollar = 0;
        // tradeSell
        this.tradeSell.from = data.from;
        this.tradeSell.to = data.to;
        this.tradeSell.pair = data.pair;
        this.tradeSell.amount = 0;
        this.tradeSell.price = 0;
        this.sellWalletDollar = 0;
        this.sellTotalWalletDollar = 0;
      }
      this.getExchangeWallet();
      this.getMyWallets();
    }
  }

  getExchangeWallet() {
    this.httpService.get('exchange/wallet/').subscribe((res?: any) => {
      if (res.status) {
        const exchangeData = _.filter(res.data, (wallet) => {
            let decimalPlaces = 6;
            if (wallet.coin === 'ANX') {
              decimalPlaces = 0;
            } else if (wallet.coin === 'HEAVEN') {
              decimalPlaces = 2;
            }
            wallet.max_balance = ShareDataService.toFixedDown(wallet.balance, decimalPlaces);
            return ['ANX', 'BTC', 'USDT', 'ETH'].indexOf(wallet.coin) > -1;
          }) || [];
        this.exchangeWallets = _.sortBy(exchangeData, ['coin']);
        this.getAvailableBalance(this.tradeTab);
      }
    }, err => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.wallet'));
    });
  }

  getMyWallets() {
    this.httpService.get('asset/').subscribe((res?: any) => {
      if (res.cryptos) {
        const myWalletsData = _.filter(res.cryptos, (wallet) => {
            let decimalPlaces = 6;
            if (wallet.name === 'ANX') {
              decimalPlaces = 0;
            } else if (wallet.name === 'HEAVEN') {
              decimalPlaces = 2;
            }
            wallet.max_quantity = ShareDataService.toFixedDown(wallet.quantity, decimalPlaces);
            return ['ANX', 'BTC', 'USDT', 'ETH'].indexOf(wallet.name) > -1;
          }) || [];
        this.myWallets = _.sortBy(myWalletsData, ['name']);
      }
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.wallet'));
    });
  }

  getMaxAmount(type) {
    if (type === 'tradeBuy') {
      if (!this.tradeBuy.price || this.tradeBuy.price === 0) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.enterAmountFirst'), this.translate.instant('pages.exchange.wallet'));
        return;
      }

      const walletData = _.findLast(this.exchangeWallets, ['coin', this.tradeBuy.to.toUpperCase()]) || {};
      this.tradeBuy.amount = ShareDataService.toFixedDown((Number(walletData.balance) / this.tradeBuy.price), 6);
    } else if (type === 'tradeSell') {
      if (!this.tradeSell.price || this.tradeSell.price === 0) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.enterAmountFirst'), this.translate.instant('pages.exchange.wallet'));
        return;
      }
      const walletData = _.findLast(this.exchangeWallets, ['coin', this.tradeSell.from.toUpperCase()]) || {};
      this.tradeSell.amount = ShareDataService.toFixedDown(Number(walletData.balance), 6);
    }
  }

  getAvailableBalance(value) {
    this.tradeTab = value;
    if (this.tradeTab === 'buy') {
      const tradeBuyObj: any = _.findLast(this.exchangeWallets, ['coin', this.tradeBuy.to.toUpperCase()]) || {};
      this.availableBalance = ShareDataService.toFixedDown(Number(tradeBuyObj.balance), 8);
      this.availableWalletType = tradeBuyObj.coin;
    } else if (this.tradeTab === 'sell') {
      const tradeSellObj: any  = _.findLast(this.exchangeWallets, ['coin', this.tradeSell.from.toUpperCase()]) || {};
      this.availableBalance = ShareDataService.toFixedDown(Number(tradeSellObj.balance), 8);
      this.availableWalletType = tradeSellObj.coin;
    }
  }

  changeWithdrawCrypto(cryptoName?: any) {
    this.withdrawWalletType = cryptoName;
    this.selectWalletData = _.find(this.exchangeWallets, ['coin', cryptoName]) || {};
    this.withdrawWalletAmount = this.selectWalletData.max_balance;
    this.withdrawAmount = 0;
    this.setWithDrawAmount(this.selectWalletData.coin);
  }

  setWithDrawAmount(walletType) {
    if (!this.withdrawAmount || !this.selectWalletData || !this.selectWalletData.coin) {
      this.selectWalletData.dollar_amount = 0;
      return;
    }

    this.fetchingWithdrawAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.selectWalletData.dollar_amount = Number(this.withdrawAmount) * data[walletType];
      this.fetchingWithdrawAmount = false;
    }, (err) => {
      this.fetchingWithdrawAmount = false;
      this.selectWalletData.dollar_amount = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  changeDepositCrypto(cryptoName?: any) {
    this.cryptoDepositType = cryptoName;
    this.seletedCryptoDepositData = _.find(this.myWallets, ['name', cryptoName]) || {};
    this.depositPopupAmount = this.seletedCryptoDepositData.max_quantity;
    this.depositAmount = 0;
    this.setDepositAmount(this.seletedCryptoDepositData.name);
  }

  setDepositAmount(cryptoType) {
    if (!this.depositAmount || !this.seletedCryptoDepositData || !this.seletedCryptoDepositData.name) {
      this.seletedCryptoDepositData.dollar_amount = 0;
      return;
    }

    this.fetchingAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.seletedCryptoDepositData.dollar_amount = Number(this.depositAmount) * data[cryptoType];
      this.fetchingAmount = false;
    }, (err) => {
      this.fetchingAmount = false;
      this.seletedCryptoDepositData.dollar_amount = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  setSendMaxValueForDeposit() {
    if (!this.seletedCryptoDepositData || !this.seletedCryptoDepositData.quantity) {
      return;
    }

    this.depositAmount = this.seletedCryptoDepositData.quantity;
    this.setDepositAmount(this.seletedCryptoDepositData.name);
  }

  setSendMaxValueForWithdraw() {
    if (!this.selectWalletData) {
      return;
    }

    this.withdrawAmount = this.selectWalletData.balance;
    this.setWithDrawAmount(this.selectWalletData.coin);
  }

  submitTradeBuy() {
    if (this.tradeBuy.price === 0 || this.tradeBuy.amount === 0) return;

    if (this.tradeBuy.pair === 'eth/btc' || this.tradeBuy.pair === 'anx/btc') {
      if (Number(this.tradeBuy.price * this.tradeBuy.amount) < 0.0005) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.validateBTCAmountMessage'), this.translate.instant('pages.exchange.toastr.tradeBuy'));
        return;
      }
    }

    const currentWallet = _.findLast(this.exchangeWallets, ['coin', this.tradeBuy.to.toUpperCase()]) || {};
    if (Number(this.tradeBuy.price * this.tradeBuy.amount) > Number(currentWallet.balance)) {
      this.toastrService.danger(this.translate.instant('pages.exchange.toastr.youDontHaveSufficientBalanceToBuy'), this.translate.instant('pages.exchange.toastr.tradeBuy'));
      return;
    }

    const buyParams = {
      'ordertype' : 'limit',
      'pair': this.tradeBuy.pair,
      'buy': true,
      'amount': this.tradeBuy.amount,
      'price': this.tradeBuy.price
    };

    this.formSubmittingBuy = true;
    this.httpService.post(buyParams, 'exchange/order_add/').subscribe((res?: any) => {
      this.formSubmittingBuy = false;
      if (res.status) {
        this.tradeBuy.price = 0;
        this.tradeBuy.amount = 0;
        this.messageEvent.emit(this.shareDataService.currentPair);
        this.toastrService.success(this.translate.instant('pages.exchange.toastr.tradeBuySuccessfully'), this.translate.instant('pages.exchange.toastr.tradeBuy'));
      }
    }, err => {
      this.formSubmittingBuy = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.tradeBuy'));
    });
  }

  submitTradeSell() {
    if (this.tradeSell.price === 0 || this.tradeSell.amount === 0) return;

    if (this.tradeSell.pair === 'eth/btc' || this.tradeSell.pair === 'anx/btc') {
      if (Number(this.tradeSell.price * this.tradeSell.amount) < 0.0005) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.validateBTCAmountMessage'), this.translate.instant('pages.exchange.toastr.tradeSell'));
        return;
      }
    }

    const currentWallet = _.findLast(this.exchangeWallets, ['coin', this.tradeSell.from.toUpperCase()]) || {};
    if (Number(this.tradeSell.amount) > Number(currentWallet.balance)) {
      this.toastrService.danger(this.translate.instant('pages.exchange.toastr.youDontHaveSufficientBalanceToSell'), this.translate.instant('pages.exchange.toastr.tradeSell'));
      return;
    }

    const sellParams = {
      'ordertype' : 'limit',
      'pair': this.tradeSell.pair,
      'buy': false,
      'amount': this.tradeSell.amount,
      'price': this.tradeSell.price
    };
    this.formSubmittingSell = true;
    this.httpService.post(sellParams, 'exchange/order_add/').subscribe((res?: any) => {
      this.formSubmittingSell = false;
      if (res.status) {
        this.tradeSell.price = 0;
        this.tradeSell.amount = 0;
        this.messageEvent.emit(this.shareDataService.currentPair);
        this.toastrService.success(this.translate.instant('pages.exchange.toastr.tradeSellSuccessfully'), this.translate.instant('pages.exchange.toastr.tradeSell'));
      }
    }, err => {
      this.formSubmittingSell = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.tradeSell'));
    });
  }

  submitWithdrawDialog(ref) {
    if (!this.withdrawAmount) {
      this.toastrService.danger(this.translate.instant('pages.exchange.toastr.pleaseEnterRequiredFieldForWithdraw'),
        this.translate.instant('pages.transfer.withdraw'));
      return;
    }

    if (Number(this.withdrawAmount) > Number(this.selectWalletData.balance)) {
      this.toastrService.danger(this.translate.instant('pages.exchange.toastr.youDontHaveSufficientBalanceToWithdraw'),
        this.translate.instant('pages.exchange.withdraw'));
      return;
    }

    const params = {'coin': this.selectWalletData.coin.toLowerCase(), 'amount': this.withdrawAmount};

    this.submitWithdrawDisable = true;
    this.httpService.post(params, 'exchange/withdraw/').subscribe((res?: any) => {
      this.submitWithdrawDisable = false;
      if (res.status) {
        this.withdrawAmount = 0;
        this.cancelDialog(ref, 'withdraw');
        this.messageEvent.emit(this.shareDataService.currentPair);
        this.toastrService.success(this.translate.instant('pages.exchange.withdrawSuccessfully'), this.translate.instant('pages.exchange.toastr.withdraw'));
      }
    }, err => {
      this.submitWithdrawDisable = false;
      this.withdrawAmount = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.withdraw'));
    });
  }

  submitDepositDialog(ref) {
    if (!this.depositAmount) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.pleaseEnterRequiredFieldForDeposit'),
        this.translate.instant('pages.exchange.deposit'));
      return;
    }

    if (Number(this.depositAmount) > Number(this.seletedCryptoDepositData.quantity)) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.youDontHaveSufficientBalanceToDeposit'),
        this.translate.instant('pages.exchange.deposit'));
      return;
    }

    const params = {'coin': this.seletedCryptoDepositData.name.toLowerCase(), 'amount': this.depositAmount};
    this.submitDepositDisable = true;
    this.httpService.post(params, 'exchange/deposit/').subscribe((res?: any) => {
      this.submitDepositDisable = false;
      if (res.status) {
        this.cancelDialog(ref, 'deposit');
        this.depositAmount = 0;
        this.messageEvent.emit(this.shareDataService.currentPair);
        this.toastrService.success(this.translate.instant('pages.exchange.toastr.depositSuccessfully'), this.translate.instant('pages.exchange.deposit'));
      }
    }, err => {
      this.submitDepositDisable = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.deposit'));
    });
  }

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      autoFocus: false,
    });
  }

  cancelDialog(ref, title) {
    if (title === 'deposit') {
      this.cryptoDepositType = this.translate.instant('common.select');
      this.seletedCryptoDepositData = {};
      this.depositAmount = 0;
    } else if (title === 'withdraw') {
      this.withdrawWalletType = this.translate.instant('common.select');
      this.selectWalletData = {};
      this.withdrawAmount = 0;
    }
    ref.close();
  }

  setBuyAmount(walletType) {
    if (!this.tradeBuy.price) {
      this.buyWalletDollar = 0;
      return;
    }
    this.setBuyTotalAmount(walletType);
    this.fetchingBuyAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.buyWalletDollar = Number(this.tradeBuy.price) * data[walletType.toUpperCase()];
      this.fetchingBuyAmount = false;
    }, (err) => {
      this.fetchingBuyAmount = false;
      this.buyWalletDollar = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  setBuyTotalAmount(walletType) {
    const totalAmount = Number(this.tradeBuy.price * this.tradeBuy.amount);
    if (!totalAmount) {
      this.buyTotalWalletDollar = 0;
      return;
    }
    this.fetchingBuyTotalAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.buyTotalWalletDollar = Number(this.tradeBuy.price * this.tradeBuy.amount) * data[walletType.toUpperCase()];
      this.fetchingBuyTotalAmount = false;
    }, (err) => {
      this.fetchingBuyTotalAmount = false;
      this.buyTotalWalletDollar = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  setSellAmount(walletType) {
    if (!this.tradeSell.price) {
      this.sellWalletDollar = 0;
      return;
    }
    this.setSellTotalAmount(walletType);
    this.fetchingSellAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.sellWalletDollar = Number(this.tradeSell.price) * data[walletType.toUpperCase()];
      this.fetchingSellAmount = false;
    }, (err) => {
      this.fetchingSellAmount = false;
      this.sellWalletDollar = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  setSellTotalAmount(walletType) {
    const totalAmount = Number(this.tradeSell.price * this.tradeSell.amount);
    if (!totalAmount) {
      this.sellTotalWalletDollar = 0;
      return;
    }
    this.fetchingSellTotalAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.sellTotalWalletDollar = Number(this.tradeSell.price * this.tradeSell.amount) * data[walletType.toUpperCase()];
      this.fetchingSellTotalAmount = false;
    }, (err) => {
      this.fetchingSellTotalAmount = false;
      this.sellTotalWalletDollar = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  ngAfterViewInit() {
    jQuery('#card-trade ul.tabs li a').click(function (e) {
      jQuery('#card-trade ul.tabs li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }
}
