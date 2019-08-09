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
  selectedCrypto:string;
  breakpoints: any;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  myWallet:any = [];
  availableWallets = [];
  withdrawAmount:number = 0;
  depositAmount:number = 0;
  seletedCryptoData: any;
  submitWithdrawDisable:boolean = false;
  submitDepositDisable:boolean = false;

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

  ngOnInit() {
    this.shareDataService.currentPair.subscribe((data?:any)=> {
      if (data) {
        this.selectedCrypto = data.from;
        this.tradeByu.from = data.from;
        this.tradeByu.to = data.to;
        this.tradeByu.pair = data.pair;

        this.tradeSell.from = data.from;
        this.tradeSell.to = data.to;
        this.tradeSell.pair = data.pair;
        this.getWalletDeposit();
        this.getWalletWithdraw();
      }
    });
  }

  getWalletDeposit(){
    this.httpService.get('exchange/wallet/').subscribe((res?:any)=>{
      if (res.status) {
        this.myWallet = res.data.wallet;
      }
    }, err=>{
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.exchange.toastr.walletError'));
    });
  }

  getWalletWithdraw(){
    this.httpService.get('asset/').subscribe((res?: any) => {
      if (res.cryptos) {
        this.availableWallets = _.filter(res.cryptos, (wallet) => {
          return ['ANL', 'ANLP', 'HEAVEN'].indexOf(wallet.name) === -1;
        });
        let data = _.filter(res.cryptos, (wallet) => {
          return [this.selectedCrypto.toUpperCase()].indexOf(wallet.name) === 0;
        });
        this.seletedCryptoData = data[0];
      }
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.baccarat'));
    });
  }

  changeCrypto(cryto){
    this.selectedCrypto = cryto.name;
    this.seletedCryptoData = cryto;
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
    if (this.tradeByu.from == 'anx') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.eos.anx.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.anx');
        return;
      }
    }else if (this.tradeByu.from == 'btc') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.btc.btc.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.btc');
        return;
      }
    }else if (this.tradeByu.from == 'eth') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.eth.eth.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.eth');
        return;
      }
    }else if (this.tradeByu.from == 'usdt') {
      if (Number(this.tradeByu.amount) >= Number(this.myWallet.btc.usdt.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.usdt');
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
    if (this.tradeSell.from == 'anx') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.eos.anx.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.anx');
        return;
      }
    }else if (this.tradeSell.from == 'btc') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.btc.btc.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.btc');
        return;
      }
    }else if (this.tradeSell.from == 'eth') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.eth.eth.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.eth');
        return;
      }
    }else if (this.tradeSell.from == 'usdt') {
      if (Number(this.tradeSell.amount) >= Number(this.myWallet.btc.usdt.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.usdt');
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
    if (this.selectedCrypto.toLowerCase() == 'anx') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoData.quantity)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.anx');
        return;
      }
    }else if (this.selectedCrypto.toLowerCase() == 'btc') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoData.quantity)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.btc');
        return;
      }
    }else if (this.selectedCrypto.toLowerCase() == 'eth') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoData.quantity)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.eth');
        return;
      }
    }else if (this.selectedCrypto.toLowerCase() == 'usdt') {
      if (Number(this.withdrawAmount) >= Number(this.seletedCryptoData.quantity)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.usdt');
        return;
      }
    }
    let params = { 'coin': this.selectedCrypto.toLowerCase(), 'amount': this.withdrawAmount };
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
    if (this.selectedCrypto.toLowerCase() == 'anx') {
      if (Number(this.depositAmount) >= Number(this.myWallet.eos.anx.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.anx');
        return;
      }
    }else if (this.selectedCrypto.toLowerCase() == 'btc') {
      if (Number(this.depositAmount) >= Number(this.myWallet.btc.btc.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.btc');
        return;
      }
    }else if (this.selectedCrypto.toLowerCase() == 'eth') {
      if (Number(this.depositAmount) >= Number(this.myWallet.eth.eth.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.eth');
        return;
      }
    }else if (this.selectedCrypto.toLowerCase() == 'usdt') {
      if (Number(this.depositAmount) >= Number(this.myWallet.btc.usdt.balance)) {
        this.toastrService.info('pages.exchange.toastr.InsufficientBalance', 'common.cryptos.usdt');
        return;
      }
    }

    let params = { 'coin': this.selectedCrypto.toLowerCase(), 'amount': this.depositAmount };
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
}