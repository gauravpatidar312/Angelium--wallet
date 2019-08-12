import { Component, OnInit, TemplateRef } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService, NbDialogService} from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
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

export class TradeComponent implements OnInit {
  private alive = true;
  formSubmittingSell:boolean = false;
  formSubmittingBuy:boolean = false;
  currentTheme: string;
  selectedCryptoWithdraw:string;
  selectedCryptoDeposit:string;
  breakpoints: any;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  myWallet:any = [];
  availableWallets = [];
  withdrawAmount:number = 0;
  depositAmount:number = 0;
  seletedCryptoWithdrawData: any = {};
  seletedCryptoDepositData: any = {};
  submitWithdrawDisable:boolean = false;
  submitDepositDisable:boolean = false;
  depositWalletAmount:number = 0;
  depositPopupAmount:number = 0;
  withdrawWalletAmount:number = 0;
  insufficientDepositeBalance:boolean = false;
  insufficientWithdrawBalance:boolean = false;
  fetchingSellAmount: boolean = false;
  sellWalletDollar:number = 0;
  fetchingSellTotalAmount: boolean = false;
  sellTotalWalletDollar:number = 0;

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService,
              private dialogService: NbDialogService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      })
    
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
    });
  }

  tradeByu = {
    'ordertype': 'limit',
    'pair':'anx/btc',
    'from':'anx',
    'to':'btc',
    'amount': 0,
    'price': 0,
    'buy': true,
    'status': 1
  }
  tradeSell = {
    'ordertype': 'limit',
    'pair': 'anx/btc',
    'from': 'anx',
    'to': 'btc',
    'amount': 0,
    'price': 0,
    'buy': false,
    'status': 1
  }

  ngOnInit() {}

  parentData(data: any){
    if (data) {
      this.tradeByu.from = data.from;
      this.tradeByu.to = data.to;
      this.tradeByu.pair = data.pair;
      this.tradeByu.amount = 0;
      this.tradeByu.price = 0;
      this.buyWalletDollar = 0;
      this.buyTotalWalletDollar = 0;

      this.tradeSell.from = data.from;
      this.tradeSell.to = data.to;
      this.tradeSell.pair = data.pair;
      this.tradeSell.amount = 0;
      this.tradeSell.price = 0;
      this.sellWalletDollar = 0;
      this.sellTotalWalletDollar = 0;

      this.getWalletDeposit(data.from);
      this.getWalletWithdraw(data.from);
    }
  }

  filterDepositeAmount(selectedCrypto){
    if (selectedCrypto == 'anx') {
      try{
        return this.myWallet.eos.anx.balance;
      }catch(ex){
        return 0;
      }
    }else if (selectedCrypto == 'btc') {
      try{
        return this.myWallet.btc.btc.balance;
      }catch(ex){
        return 0;
      }
    }else if (selectedCrypto == 'eth') {
      try{
        return this.myWallet.eth.eth.balance;
      }catch(ex){
        return 0;
      }
    }else if (selectedCrypto == 'usdt') {
      try{
        return this.myWallet.btc.usdt.balance;
      }catch(ex){
        return 0;
      }
    }else{
      return 0;
    }
  }

  getWalletDeposit(from:string){
    this.httpService.get('exchange/wallet/').subscribe((res?:any)=>{
      if (res.status) {
        this.myWallet = res.data.wallet;
        let balance = this.filterDepositeAmount(from.toLowerCase());
        this.depositWalletAmount = balance; 
        this.depositPopupAmount = balance;
      }
    }, err=>{
      this.depositWalletAmount = 0;
      this.depositPopupAmount = 0;
      this.insufficientDepositeBalance = true;
      this.toastrService.danger(
        this.shareDataService.getErrorMessage(err), 
        this.translate.instant('pages.exchange.toastr.walletError'));
    });
  }

  getWalletWithdraw(from:string){
    this.httpService.get('asset/').subscribe((res?: any) => {
      if (res.cryptos) {
        this.availableWallets = _.filter(res.cryptos, (wallet) => {
          return ['ANX', 'BTC', 'USDT', 'ETH'].indexOf(wallet.name) > -1;
        });
        let data = _.filter(res.cryptos, (wallet) => {
          return [from.toUpperCase()].indexOf(wallet.name) === 0;
        });
        this.seletedCryptoWithdrawData = data[0];
        this.seletedCryptoDepositData = data[0];
        this.withdrawWalletAmount = this.seletedCryptoWithdrawData.quantity;
      }
    }, (err) => {
      this.withdrawWalletAmount = 0;
      this.insufficientWithdrawBalance = true;
      this.toastrService.danger(
        this.shareDataService.getErrorMessage(err), this.translate.instant('common.baccarat'));
    });
  }

  changeWithdrawCrypto(cryto?:any){
    this.seletedCryptoWithdrawData = cryto;
    this.withdrawWalletAmount = this.seletedCryptoWithdrawData.quantity;
  }

  changeDepositCrypto(cryto?:any){
    this.seletedCryptoDepositData = cryto;
    let balance = this.filterDepositeAmount(cryto.name.toLowerCase());
    this.depositPopupAmount = balance;
  }

  ngAfterViewInit() {
    jQuery('ul.tabs li').click(function (e) {
      var tab_id = jQuery(this).attr('data-tab');
      jQuery('ul.tabs li').removeClass('active');
        jQuery('.tab-content').removeClass('active');
        jQuery(this).addClass('active');
        jQuery("#"+tab_id).addClass('active');
    });
  }

  submitTradeBuy(){
    if (this.tradeByu.price == 0 || this.tradeByu.amount == 0) return;
    if (this.insufficientDepositeBalance) {
      this.toastrService.danger(this.translate.instant('Doesnt have a wallet yet'), 'Wallet');
      return;
    }
    if (this.tradeByu.from == 'anx') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.eos.anx.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ANX');
        return;
      }
    }else if (this.tradeByu.from == 'btc') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.btc.btc.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'BTC');
        return;
      }
    }else if (this.tradeByu.from == 'eth') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.eth.eth.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ETH');
        return;
      }
    }else if (this.tradeByu.from == 'usdt') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.btc.usdt.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'USDT');
        return;
      }
    }
    this.formSubmittingBuy = true;
    
    this.httpService.post(this.tradeByu, 'exchange/order_add/').subscribe((res?:any)=>{
      this.formSubmittingBuy = false;
      if (res.status) {
        this.tradeByu.price = 0;
        this.tradeByu.amount = 0;
        this.toastrService.success(this.translate.instant('pages.exchange.toastr.tradeBuy'), this.translate.instant('pages.exchange.toastr.tradeBuySuccessfully'));
      }
    }, err=>{
      this.formSubmittingBuy = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.tradeBuyError'));
    });
  }

  submitTradeSell(){
    if (this.tradeSell.price == 0 || this.tradeSell.amount == 0) return;
    if (this.insufficientDepositeBalance) {
      this.toastrService.danger(this.translate.instant('Doesnt have a wallet yet'), 'Wallet');
      return;
    }
    if (this.tradeSell.from == 'anx') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.eos.anx.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ANX');
        return;
      }
    }else if (this.tradeSell.from == 'btc') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.btc.btc.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'BTC');
        return;
      }
    }else if (this.tradeSell.from == 'eth') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.eth.eth.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ETH');
        return;
      }
    }else if (this.tradeSell.from == 'usdt') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.btc.usdt.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'USDT');
        return;
      }
    }
    
    this.formSubmittingSell = true;
    this.httpService.post(this.tradeSell, 'exchange/order_add/').subscribe((res?:any)=>{
      this.formSubmittingSell = false;
      if (res.status) {
        this.tradeSell.price = 0;
        this.tradeSell.amount = 0;
        this.toastrService.success(this.translate.instant('pages.exchange.toastr.tradeSell'), this.translate.instant('pages.exchange.toastr.tradeSellSuccessfully'));
      }
    }, err=>{
      this.formSubmittingSell = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.tradeSellError'));
    });
  }

  submitWithdrawDialog(ref){
    if (this.withdrawAmount == 0) return;
    if (this.insufficientWithdrawBalance) {
      this.toastrService.danger(this.translate.instant('Doesnt have a wallet yet'), 'Wallet');
      return;
    }
    if (this.seletedCryptoWithdrawData.name.toLowerCase() == 'anx') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoWithdrawData.quantity)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ANX');
        return;
      }
    }else if (this.seletedCryptoWithdrawData.name.toLowerCase() == 'btc') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoWithdrawData.quantity)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'BTC');
        return;
      }
    }else if (this.seletedCryptoWithdrawData.name.toLowerCase() == 'eth') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoWithdrawData.quantity)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ETH');
        return;
      }
    }else if (this.seletedCryptoWithdrawData.name.toLowerCase() == 'usdt') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoWithdrawData.quantity)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'USDT');
        return;
      }
    }
    let params = { 'coin': this.seletedCryptoWithdrawData.name.toLowerCase(), 'amount': this.withdrawAmount };
    
    this.submitWithdrawDisable  = true;
    this.httpService.post(params, 'exchange/withdraw/').subscribe((res?:any)=>{
      this.submitWithdrawDisable  = false;
      this.cancelDialog(ref);
      if (res.status) {
        this.withdrawAmount = 0;
        this.toastrService.success(this.translate.instant('pages.exchange.toastr.withdraw'), this.translate.instant('pages.exchange.withdrawSuccessfully'));
      }
    }, err=>{
      this.submitWithdrawDisable  = false;
      this.withdrawAmount = 0;
      this.cancelDialog(ref);
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.withdrawError'));
    });
  }

  submitDepositDialog(ref){
    if (this.depositAmount == 0) return;
    if (this.insufficientDepositeBalance) {
      this.toastrService.danger(this.translate.instant('Doesnt have a wallet yet'), 'Wallet');
      return;
    }
    if (this.seletedCryptoDepositData.name.toLowerCase() == 'anx') {
      if (Number(this.depositAmount) >= Number(this.myWallet.eos.anx.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ANX');
        return;
      }
    }else if (this.seletedCryptoDepositData.name.toLowerCase() == 'btc') {
      if (Number(this.depositAmount) >= Number(this.myWallet.btc.btc.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'BTC');
        return;
      }
    }else if (this.seletedCryptoDepositData.name.toLowerCase() == 'eth') {
      if (Number(this.depositAmount) >= Number(this.myWallet.eth.eth.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'ETH');
        return;
      }
    }else if (this.seletedCryptoDepositData.name.toLowerCase() == 'usdt') {
      if (Number(this.depositAmount) >= Number(this.myWallet.btc.usdt.balance)) {
        this.toastrService.danger(this.translate.instant('pages.exchange.toastr.InsufficientBalance'), 'USDT');
        return;
      }
    }

    let params = { 'coin': this.seletedCryptoDepositData.name.toLowerCase(), 'amount': this.depositAmount };
    this.submitDepositDisable  = true;
    this.httpService.post(params, 'exchange/deposit/').subscribe((res?:any)=>{
      this.submitDepositDisable  = false;
      this.cancelDialog(ref);
      if (res.status) {
        this.depositAmount = 0;
        this.toastrService.success(this.translate.instant('pages.exchange.deposit'), this.translate.instant('pages.exchange.toastr.depositSuccessfully'));
      }
    }, err=>{
      this.submitDepositDisable  = false;
      this.depositAmount = 0;
      this.cancelDialog(ref);
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.depositError'));
    });
  }

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      autoFocus: false,
    });
  }

  cancelDialog(ref) {
    ref.close();
  }

  fetchingBuyAmount: boolean = false;
  buyWalletDollar:number = 0;
  setBuyAmount(walletType) {
    if (!this.tradeByu.price) {
      this.buyWalletDollar = 0;
      return;
    }
    this.setBuyTotalAmount(walletType);
    this.fetchingBuyAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.buyWalletDollar = Number(this.tradeByu.price) * data[walletType.toUpperCase()];
      this.fetchingBuyAmount = false;
    }, (err) => {
      this.fetchingBuyAmount = false;
      this.buyWalletDollar = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }
  
  fetchingBuyTotalAmount: boolean = false;
  buyTotalWalletDollar:number = 0;
  setBuyTotalAmount(walletType) {
    let totalAmount = Number(this.tradeByu.price * this.tradeByu.amount);
    if (!totalAmount) {
      this.buyTotalWalletDollar = 0;
      return;
    }
    this.fetchingBuyTotalAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.buyTotalWalletDollar = Number(this.tradeByu.price * this.tradeByu.amount) * data[walletType.toUpperCase()];
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
    let totalAmount = Number(this.tradeSell.price * this.tradeSell.amount);
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
}