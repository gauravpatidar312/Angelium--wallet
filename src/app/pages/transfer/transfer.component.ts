import {Component, OnInit, TemplateRef} from '@angular/core';
import {NbDialogService, NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';
import {ShareDataService} from '../../services/share-data.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from '../../services/toastr.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from 'environments/environment';
import * as _ from 'lodash';

declare const jQuery: any;
@Component({
  selector: 'ngx-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  private alive = true;
  isProduction: any = environment.production;
  sendForm: FormGroup;
  sendType: string = 'SELECT';
  receiveType: string = 'SELECT';
  fromType: string = 'ANX';
  toType: string = 'SELECT';
  fromTypes: string[] = ['ANX'];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  currentTheme: string;
  setReceiveTab: boolean = false;
  setOTCTab: boolean = false;
  submitted: boolean = false;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;
  toggle: boolean;
  waitFlag: boolean = false;
  myWallets: any = [];
  sendWallet: any = {};
  receiveWallet: any = {};
  anxWallet: any = {};
  otcWallet: any = {};
  otcWallets: any = [];
  fromOTCAmount: number;
  trade_password: any = '';

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private sessionStorageService: SessionStorageService,
              private activatedRoute: ActivatedRoute) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit() {
    this.toggle = null;
    this.getWallets();
    if (this.shareDataService.transferTab) {
      if (this.shareDataService.transferTab === 'RECEIVE') {
        this.setReceiveTab = true;
      } else if (this.shareDataService.transferTab === 'OTC') {
        this.setOTCTab = true;
      }
    }

    if (this.sessionStorageService.getFromSession('waitTime')) {
      const waitTime = new Date(this.sessionStorageService.getFromSession('waitTime'));
      const seconds = (waitTime.getTime() - new Date().getTime());
      if (seconds > 0) {
        this.waitFlag = true;
        setTimeout(() => {
          this.waitFlag = false;
          this.sessionStorageService.deleteFromSession('waitTime');
        }, seconds);
      } else {
        this.sessionStorageService.deleteFromSession('waitTime');
      }
    }

    this.sendForm = this.formBuilder.group({
      transfer_amount: ['', Validators.required],
      destination_address: ['', Validators.required],
    });
  }

  get f() {
    return this.sendForm.controls;
  }

  getWallets() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      this.myWallets = _.sortBy(res, ['wallet_type']);
      if (this.isProduction)
        this.otcWallets = _.filter(this.myWallets, ['wallet_type', 'BTC']) || [];
      else
        this.otcWallets = this.myWallets;

      if (!this.myWallets) {
        this.sendType = 'SELECT';
        this.receiveType = 'SELECT';
        this.toType = 'SELECT';
      } else if (this.shareDataService.transferTab) {
        this.onChangeWallet(this.shareDataService.transferTitle, this.shareDataService.transferTab.toLowerCase());
        this.shareDataService.transferTab = null;
        this.shareDataService.transferTitle = null;
      }

      this.httpService.get('anx-price/').subscribe((price) => {
        this.anxWallet.anx_price = Number(price['anx_price']);

        this.httpService.get('get-total-anx/').subscribe((data) => {
          this.anxWallet.wallet_amount = data['total-anx'];
          this.fromOTCAmount = Number(Number(this.anxWallet.wallet_amount).toFixed(2));
          this.setOTCAmount();
        });
      });
    });
  }

  copyAddress() {
    if (this.receiveWallet.address)
      this.toastrService.success('Wallet address copied successfully!', 'Copy Address');
  }

  openTradeDialog(dialog: TemplateRef<any>) {
    if (this.isProduction && this.sendWallet.wallet_type === 'USDT') {
      this.toastrService.info('Feature coming soon! Stay tuned.', 'Send');
      return;
    }

    if (!this.sendForm.value || !this.sendForm.value.transfer_amount || !Number(this.sendForm.value.transfer_amount) || !this.sendForm.value.destination_address) {
      this.toastrService.danger('Please enter required field for transfer.', 'Send');
      return;
    }

    if (Number(this.sendForm.value.transfer_amount) > Number(this.sendWallet.wallet_amount)) {
      this.toastrService.danger('You don\'t have sufficient balance to send.', 'Send');
      return;
    }

    this.dialogService.open(dialog,  {
      closeOnBackdropClick: false,
      autoFocus: false,
    });
  }

  tradPasswordDialog(ref: any) {
    if (!this.trade_password) {
      this.toastrService.danger('Please enter your trade password.', 'Trade Password');
      return;
    }
    const endpoint = 'verify-trade-password/';
    const apiData = {'trade_password': this.trade_password};
    this.httpService.post(apiData, endpoint)
      .subscribe((res?: any) => {
        if (res.status) {
          ref.close();
          this.trade_password = null;
          this.onSendTransfer();
        } else {
          this.toastrService.danger(res.message, 'Trade Password');
        }
      }, err => {
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Trade Password');
      });
  }

  cancelTradeDialog(ref) {
    this.trade_password = null;
    ref.close();
  }

  setAmount(walletType) {
    if (!this.sendForm.value.transfer_amount) {
      this.sendWallet.walletDollar = 0;
      return;
    }

    this.fetchingAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.sendWallet.walletDollar = Number(this.sendForm.value.transfer_amount) * data[walletType];
      this.fetchingAmount = false;
    }, (err) => {
      this.fetchingAmount = false;
      this.sendWallet.walletDollar = 0;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
    });
  }

  setSendMaxValue() {
    if (!this.sendWallet || !this.sendWallet.wallet_amount) {
      return;
    }

    this.sendForm.controls.transfer_amount.setValue(Number(Number(this.sendWallet.wallet_amount).toFixed(6)));
    this.setAmount(this.sendWallet.wallet_type);
  }

  setOTCAmount() {
    if (!this.fromOTCAmount) {
      this.otcWallet.toAmount = 0;
      this.otcWallet.toDollar = 0;
      this.anxWallet.walletDollar = 0;
      return;
    }

    this.otcWallet.toAmount = 0;
    this.anxWallet.walletDollar = this.fromOTCAmount * this.anxWallet.anx_price;

    const toWallet = this.myWallets.find(item => {
      return item.wallet_type === this.toType;
    });

    if (!toWallet) {
      return;
    }

    const obj = {
      'dollar_amount': this.anxWallet.walletDollar,
      'crypto_currency_code': toWallet.wallet_type,
    };

    this.fetchingAmount = true;
    this.httpService.post(obj, 'convert_to_crypto/').subscribe((rate?: any) => {
      if (rate.ERROR || rate.Error) {
        this.fetchingAmount = false;
        this.toastrService.danger(rate.ERROR || rate.Error, 'Fetching Amount');
        return;
      }
      this.httpService.get('live-price/').subscribe(data => {
        this.otcWallet.toAmount = rate.exchanged_rate;
        this.otcWallet.toDollar = this.otcWallet.toAmount * data[this.toType];
        this.fetchingAmount = false;
      }, (err) => {
        this.fetchingAmount = false;
        this.otcWallet.toAmount = 0;
        this.otcWallet.toDollar = 0;
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
      });
    }, (err) => {
      this.fetchingAmount = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
    });
  }

  setAnxMaxValue() {
    this.fromOTCAmount = Number(Number(this.anxWallet.wallet_amount).toFixed(2));
    this.setOTCAmount();
  }

  onChangeWallet(walletType: string, typeValue): void {
    if (typeValue === 'send') {
      this.sendType = walletType;
      this.sendWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
      if (!this.sendWallet) {
        this.sendType = 'BTC';
        this.sendWallet = this.myWallets.find(item => {
          return item.wallet_type === 'BTC';
        });
      }
      if (this.sendWallet) {
        // this.sendForm.controls.transfer_amount.setValue(this.sendWallet.wallet_amount);
        this.sendForm.controls.transfer_amount.setValue(0);
        this.setAmount(walletType);
      }
    } else if (typeValue === 'receive') {
      this.receiveType = walletType;
      this.receiveWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
      if (!this.receiveWallet) {
        this.receiveType = 'BTC';
        this.receiveWallet = this.myWallets.find(item => {
          return item.wallet_type === 'BTC';
        });
      }
    } else if (typeValue === 'from') {
      this.fromType = walletType;
    } else if (typeValue === 'to') {
      this.toType = walletType;
      this.otcWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
      this.setOTCAmount();
    }
  }

  onSendTransfer() {
    if (this.isProduction && this.sendWallet.wallet_type === 'USDT') {
      this.toastrService.info('Feature coming soon! Stay tuned.', 'Send');
      return;
    }

    if (!this.sendForm.value || !this.sendForm.value.transfer_amount || !Number(this.sendForm.value.transfer_amount) || !this.sendForm.value.destination_address) {
      this.toastrService.danger('Please enter required field for transfer.', 'Send');
      return;
    }

    if (Number(this.sendForm.value.transfer_amount) > Number(this.sendWallet.wallet_amount)) {
      this.toastrService.danger('You don\'t have sufficient balance to send.', 'Send');
      return;
    }

    // Disabled this check for now
    // if (this.sendWallet.wallet_type === 'BTC' && this.sendWallet.walletDollar < 100) {
    //   this.toastrService.danger('Minimum amount for BTC transfer is $100 for beta version.', 'OTC');
    //   return;
    // }

    const transferObj = {
      'user_wallet': this.sendWallet.id,
      'destination_address': this.sendForm.value.destination_address,
      'transfer_amount': Number(this.sendForm.value.transfer_amount),
    };

    this.waitFlag = true;
    this.formSubmitting = true;
    this.httpService.post(transferObj, 'transfer/').subscribe((res?: any) => {
      if (res.status) {
        // 15 seconds wait time for next transaction.
        let currentTime = new Date();
        currentTime.setSeconds(currentTime.getSeconds() + 15);
        this.sessionStorageService.saveToSession('waitTime', currentTime);
        setTimeout(() => {
          this.waitFlag = false;
          this.sessionStorageService.deleteFromSession('waitTime');
        }, 15000);

        this.formSubmitting = false;
        this.toastrService.success('Transfer successfully completed!', 'Send');
        this.httpService.get('user-wallet-address/').subscribe((data?: any) => {
          this.myWallets = data;
        });
        this.onChangeWallet(this.sendWallet.wallet_type, 'send');
        this.sendForm.controls.destination_address.setValue(null);
      } else {
        this.waitFlag = false;
        this.formSubmitting = false;
        this.toastrService.danger(res.message, 'Send');
      }
    }, (err) => {
      this.waitFlag = false;
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Send');
    });
  }

  onOTCTransfer() {
    if (this.isProduction) {
      this.toastrService.danger('Feature coming soon! Stay tuned.', 'OTC');
      return;
    }

    if (!this.fromOTCAmount || !Number(this.fromOTCAmount)) {
      this.toastrService.danger('Please enter transfer amount.', 'OTC');
      return;
    }
    if (Number(this.fromOTCAmount) > Number(this.anxWallet.wallet_amount)) {
      this.toastrService.danger('You don\'t have sufficient balance to send.', 'OTC');
      return;
    }
    if (!this.otcWallet || !this.otcWallet.toAmount) {
      this.toastrService.danger('Please check receive amount.', 'OTC');
      return;
    }

    // Disabled this check for now
    // if (this.otcWallet.wallet_type === 'BTC' && this.anxWallet.walletDollar < 100) {
    //   this.toastrService.danger('Minimum amount for BTC transfer is $100 for beta version.', 'OTC');
    //   return;
    // }

    const transferObj = {
      'user_wallet': this.otcWallet.id,
      'transfer_amount': this.otcWallet.toAmount,
      'anx_amount': this.fromOTCAmount,
    };
    this.formSubmitting = true;
    this.httpService.post(transferObj, 'transfer-otc/').subscribe((res?: any) => {
      if (res.status) {
        this.formSubmitting = false;
        this.toastrService.success('Transfer successfully completed!', 'OTC');
        this.httpService.get('anx-price/').subscribe((price) => {
          this.anxWallet.anx_price = Number(price['anx_price']);

          this.httpService.get('get-total-anx/').subscribe((data) => {
            this.anxWallet.wallet_amount = data['total-anx'];
            this.fromOTCAmount = Number(Number(this.anxWallet.wallet_amount).toFixed(2));
            this.setOTCAmount();
          });
        });
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(res.message, 'OTC');
      }
    }, err => {
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'OTC');
    });
  }
}
