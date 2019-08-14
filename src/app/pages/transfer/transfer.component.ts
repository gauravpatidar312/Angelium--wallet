import {Component, OnInit, TemplateRef} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {NbDialogService, NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';
import {ShareDataService} from '../../services/share-data.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {IndexedDBStorageService} from '../../services/indexeddb-storage.service';
import {HttpService} from '../../services/http.service';
import {ToastrService} from '../../services/toastr.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from 'environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {LocalDataSource} from 'ng2-smart-table';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from 'moment';
declare const jQuery: any;

@Component({
  selector: 'ngx-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  private alive = true;
  minerFee: number = 0;
  minMinutes: number = 0;
  maxMinutes: number = 0;
  fees: number[] = [10, 20, 30];
  isProduction: any = environment.production;
  sendType: string = 'SELECT';
  receiveType: string =  'SELECT';
  user: any;
  fromType: string = 'ANX';
  toType: string =  'SELECT';
  fromTypes: string[] = ['ANX'];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  setReceiveTab: boolean = false;
  setOTCTab: boolean = false;
  submitted: boolean = false;
  formSubmitting: boolean = false;
  fetchingAmount: boolean = false;
  toggle: boolean;
  waitFlag: boolean = false;
  myWallets: any = [];
  sendWallet: any = {};
  sendWallets: any = [];
  receiveWallet: any = {};
  anxWallet: any = {};
  otcWallet: any = {};
  otcWallets: any = [];
  fromOTCAmount: number;
  transfer_amount: number;
  destination_address: number;
  trade_password: any = '';
  fetchTransferHistory: boolean = false;
  usernameForOTC: any = ['forex711', 'ramy', 'riogrande', 'xwalker', 'xwalker-n', 'mr.angelium'];

  constructor(private httpService: HttpService,
              private decimalPipe: DecimalPipe,
              private dialogService: NbDialogService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private sessionStorage: SessionStorageService,
              private storageService: IndexedDBStorageService,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute) {
    this.user = this.sessionStorage.getFromSession('userInfo');

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  transfers = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: true,
    },
    editable: true,
    mode: 'inline',
    noDataMessage: this.translate.instant('pages.heaven.noDataFound'),
    columns: {
      timestamp: {
        title: this.translate.instant('common.date'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans action-width">${cell}</div>`;
        },
      },
      direction: {
        title: this.translate.instant('pages.transfer.action'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell === 'SEND')
            return `<div class="heavenhistory-cell font-nunitoSans action-width"><span><i class="fa fa-arrow-right"></i></span><span class="pl-3">${cell}</span></div>`;
          else if (cell === 'RECEIVE')
            return `<div class="heavenhistory-cell font-nunitoSans action-width"><span><i class="fa fa-arrow-left"></i></span><span class="pl-3">${cell}</span></div>`;
          else
            return `<div class="heavenhistory-cell font-nunitoSans action-width"><span><i class="fa fa-exchange"></i></span><span class="pl-3">${cell}</span></div>`;
        },
      },
      quantity: {
        title: this.translate.instant('common.amount'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans">${cell}</div>`;
        },
      },
      crypto: {
        title: this.translate.instant('common.assets'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans">${cell}</div>`;
        },
      },
      address: {
        title: this.translate.instant('pages.transfer.address'),
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<div class="heavenhistory-cell font-nunitoSans">${cell}</div>`;
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  async ngOnInit() {
    this.toggle = null;
    this.getWallets();
    this.getTransferHistory();
    if (this.shareDataService.transferTab) {
      if (this.shareDataService.transferTab === 'RECEIVE') {
        this.setReceiveTab = true;
      } else if (this.shareDataService.transferTab === 'OTC') {
        this.setOTCTab = true;
      }
    }

    const angeliumnInfo: any = await this.storageService.getAngeliumStorage();
    if (angeliumnInfo) {
      if (angeliumnInfo.waitTime) {
        const waitTime = new Date(angeliumnInfo.waitTime);
        const seconds = (waitTime.getTime() - new Date().getTime());
        if (seconds > 0) {
          this.waitFlag = true;
          setTimeout(() => {
            this.waitFlag = false;
            this.storageService.saveToAngeliumSession({'waitTime': null});
          }, seconds);
        } else {
          this.storageService.saveToAngeliumSession({'waitTime': null});
        }
      }
    }
    // if (this.sessionStorageService.getFromSession('waitTime')) {
    //   const waitTime = new Date(this.sessionStorageService.getFromSession('waitTime'));
    //   const seconds = (waitTime.getTime() - new Date().getTime());
    //   if (seconds > 0) {
    //     this.waitFlag = true;
    //     setTimeout(() => {
    //       this.waitFlag = false;
    //       this.sessionStorageService.deleteFromSession('waitTime');
    //     }, seconds);
    //   } else {
    //     this.sessionStorageService.deleteFromSession('waitTime');
    //   }
    // }
  }

  setMinerFee(fee: number) {
    this.minerFee = fee;
    if (this.minerFee === 10) {
      this.minMinutes = 20;
      this.maxMinutes = 50;
    } else if (this.minerFee === 20) {
      this.minMinutes = 10;
      this.maxMinutes = 20;
    } else if (this.minerFee === 30) {
      this.minMinutes = 5;
      this.maxMinutes = 10;
    }
  }

  getWallets() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      const walletData = _.filter(res, (wallet?: any) => {
        wallet.title = wallet.wallet_type;
        if (wallet.wallet_type === 'USDT')
          wallet.title = 'USDT (OMNI)';
        else if (wallet.wallet_type === 'ERCUSDT')
          wallet.title = 'USDT (ERC20)';
        return wallet.wallet_type !== 'ANX';
      });
      this.myWallets = _.sortBy(walletData, ['title']);

      this.sendWallets = _.filter(this.myWallets, (wallet?: any) => {
          return wallet.wallet_type !== 'ERCUSDT';
        }) || [];
      this.otcWallets = _.filter(this.myWallets, ['wallet_type', 'BTC']) || [];

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

        this.httpService.get('asset/').subscribe((data?: any) => {
          const anxData = _.find(data.cryptos, ['name', 'ANX']) || {};
          this.anxWallet.wallet_amount = anxData.quantity || 0;
          this.fromOTCAmount = this.anxWallet.wallet_amount;
          this.setOTCAmount();
        });
      });
    });
  }

  getTransferHistory() {
    jQuery('.transfer-history-spinner').height(jQuery('#transfer-history').height());
    this.fetchTransferHistory = true;
    this.httpService.get(`transactions-history/`).subscribe((res?: any) => {
      const data = _.orderBy(res.data, ['timestamp'], ['desc']);
      const transfer_data = _.map(data, (obj?: any) => {
        if (obj.direction === 'in')
          obj.direction = 'RECEIVE';
        else if (obj.direction === 'out')
          obj.direction = 'SEND';
        else
          obj.direction = 'OTC';
        obj.timestamp = moment(obj.timestamp).format('YYYY.MM.DD HH:mm');
        obj.quantity = this.decimalPipe.transform(ShareDataService.toFixedDown(obj.quantity, 6), '1.0-6');
        obj.address = obj.address || '';
        return obj;
      });
      this.source.load(transfer_data);
      this.fetchTransferHistory = false;
    }, (err) => {
      this.fetchTransferHistory = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.transfer'));
    });
  }

  copyAddress() {
    if (this.receiveWallet.address)
      this.toastrService.success(this.translate.instant('pages.transfer.toastr.walletAddressCopiedSuccessfully'),
      this.translate.instant('pages.transfer.toastr.copyAddress'));
  }

  openTradeDialog(dialog: TemplateRef<any>) {
    if (this.sendWallet.wallet_type === 'USDT' && !this.minerFee) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.minerFeeError'),
      this.translate.instant('pages.transfer.send'));
      return;
    }

    if (!this.transfer_amount || !Number(this.transfer_amount) || !this.destination_address) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.pleaseEnterRequiredFieldForTransfer'),
      this.translate.instant('pages.transfer.send'));
      return;
    }

    if (Number(this.transfer_amount) > Number(this.sendWallet.wallet_amount)) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.youDontHaveSufficientBalanceToSend'),
      this.translate.instant('pages.transfer.send'));
      return;
    }

    this.setAmount(this.sendWallet.wallet_type);

    this.dialogService.open(dialog,  {
      closeOnBackdropClick: false,
      autoFocus: false,
    });
  }

  tradPasswordDialog(ref: any) {
    if (!this.trade_password) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.pleaseEnterYourTradePassword'),
      this.translate.instant('common.tradePassword'));
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
          this.toastrService.danger(res.message, this.translate.instant('common.tradePassword'));
        }
      }, err => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err),
        this.translate.instant('common.tradePassword'));
      });
  }

  cancelTradeDialog(ref) {
    this.trade_password = null;
    ref.close();
  }

  setAmount(walletType) {
    if (!this.transfer_amount) {
      this.sendWallet.walletDollar = 0;
      return;
    }

    this.fetchingAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      this.sendWallet.walletDollar = Number(this.transfer_amount) * data[walletType];
      this.fetchingAmount = false;
    }, (err) => {
      this.fetchingAmount = false;
      this.sendWallet.walletDollar = 0;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  setSendMaxValue() {
    if (!this.sendWallet || !this.sendWallet.wallet_amount) {
      return;
    }

    this.transfer_amount = this.sendWallet.wallet_amount;
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
        this.otcWallet.toAmount = 0;
        this.otcWallet.toDollar = 0;
        this.toastrService.danger(rate.ERROR || rate.Error, this.translate.instant('common.fetchingAmount'));
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
        this.toastrService.danger(this.shareDataService.getErrorMessage(err),
        this.translate.instant('common.fetchingAmount'));
      });
    }, (err) => {
      this.fetchingAmount = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err),
      this.translate.instant('common.fetchingAmount'));
    });
  }

  setAnxMaxValue() {
    this.fromOTCAmount = this.anxWallet.wallet_amount;
    this.setOTCAmount();
  }

  onChangeWallet(walletType: string, typeValue): void {
    if (typeValue === 'send') {
      const walletObject: any = _.find(this.myWallets, ['wallet_type', walletType]) || {};
      this.sendType = walletObject.title;
      if (this.sendType  !== 'SELECT') {
        this.sendWallet = this.myWallets.find(item => {
          return item.wallet_type === walletType;
        });
        if (!this.sendWallet) {
          this.sendType = 'BTC';
          this.sendWallet = this.myWallets.find(item => {
            return item.wallet_type === 'BTC';
          });
        }
      } else if (this.sendType === 'SELECT') {
        this.sendWallet = {};
      }
      if (this.sendWallet) {
        // this.sendForm.controls.transfer_amount.setValue(this.sendWallet.wallet_amount);
        this.transfer_amount = 0;
        this.setAmount(walletType);
      }
    } else if (typeValue === 'receive') {
      const walletObject: any = _.find(this.myWallets, ['wallet_type', walletType]) || {};
      this.receiveType = walletObject.title;
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
    if (this.sendWallet.wallet_type === 'USDT' && !this.minerFee) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.minerFeeError'),
      this.translate.instant('pages.transfer.send'));
      return;
    }

    if (!this.transfer_amount || !Number(this.transfer_amount) || !this.destination_address) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.pleaseEnterRequiredFieldForTransfer'),
      this.translate.instant('pages.transfer.send'));
      return;
    }

    if (Number(this.transfer_amount) > Number(this.sendWallet.wallet_amount)) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.youDontHaveSufficientBalanceToSend'),
      this.translate.instant('pages.transfer.send'));
      return;
    }

    // Disabled this check for now
    // if (this.sendWallet.wallet_type === 'BTC' && this.sendWallet.walletDollar < 100) {
    //   this.toastrService.danger('Minimum amount for BTC transfer is $100 for beta version.', 'OTC');
    //   return;
    // }

    let validateEndpoint = '';
    if (this.sendWallet.wallet_type === 'BTC')
      validateEndpoint = 'validate_btc/';
    else if (this.sendWallet.wallet_type === 'USDT')
      validateEndpoint = 'validate_usdt/';
    if (validateEndpoint) {
      this.httpService.post({'amount': Number(this.transfer_amount)}, validateEndpoint).subscribe((res?: any) => {
        if (res.status)
          this.sendTransferApi();
        else
          this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('pages.transfer.send'));
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.transfer.send'));
      });
    } else
      this.sendTransferApi();
  }

  sendTransferApi() {
    const transferObj: any = {
      'user_wallet': this.sendWallet.id,
      'destination_address': this.destination_address,
      'transfer_amount': Number(this.transfer_amount),
    };
    if (this.sendWallet.wallet_type === 'USDT') {
      transferObj.miner_fee = this.minerFee;
    }

    this.waitFlag = true;
    this.formSubmitting = true;
    this.httpService.post(transferObj, 'transfer/').subscribe((res?: any) => {
      if (res.status) {
        // 15 seconds wait time for next transaction.
        const currentTime = new Date();
        currentTime.setSeconds(currentTime.getSeconds() + 15);
        // this.sessionStorageService.saveToSession('waitTime', currentTime);
        this.storageService.saveToAngeliumSession({'waitTime': currentTime});
        setTimeout(() => {
          this.waitFlag = false;
          // this.sessionStorageService.deleteFromSession('waitTime');
          this.storageService.saveToAngeliumSession({'waitTime': null});
        }, 15000);

        this.formSubmitting = false;
        this.toastrService.success(this.translate.instant('pages.transfer.toastr.transferSuccessfullyCompleted'),
        this.translate.instant('pages.transfer.send'));
        this.httpService.get('user-wallet-address/').subscribe((data?: any) => {
          const walletData = _.filter(data, (wallet?: any) => {
            wallet.title = wallet.wallet_type;
            if (wallet.wallet_type === 'USDT')
              wallet.title = 'USDT (OMNI)';
            else if (wallet.wallet_type === 'ERCUSDT')
              wallet.title = 'USDT (ERC20)';
            return wallet.wallet_type !== 'ANX';
          });
          this.myWallets = _.sortBy(walletData, ['title']);
          this.sendWallets = _.filter(this.myWallets, (wallet?: any) => {
              return wallet.wallet_type !== 'ERCUSDT';
            }) || [];
        });
        this.onChangeWallet('SELECT', 'send');
        this.destination_address = null;
      } else {
        this.waitFlag = false;
        this.formSubmitting = false;
        this.toastrService.danger(res.message, this.translate.instant('pages.transfer.send'));
      }
    }, (err) => {
      this.waitFlag = false;
      this.formSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.transfer.send'));
    });
  }

  onOTCTransfer() {
    /*if (this.isProduction && this.otcWallet.wallet_type === 'USDT' && this.user.user_type !== AppConstants.ROLES.ADMIN && this.usernameForOTC.indexOf(this.user.username.toLowerCase()) === -1) {
      this.toastrService.info(this.translate.instant('pages.transfer.toastr.featureComingSoonStayTuned'),
        this.translate.instant('pages.transfer.toastr.otc'));
      return;
    }*/

    if (!this.user.kyc_info || this.user.kyc_info.status_description !== 'confirmed') {
      this.toastrService.info(this.translate.instant('pages.transfer.toastr.kycNotApproved'), this.translate.instant('pages.transfer.toastr.otc'));
      return;
    }

    if (!this.fromOTCAmount || !Number(this.fromOTCAmount)) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.pleaseEnterTransferAmount'),
        this.translate.instant('pages.transfer.toastr.otc'));
      return;
    }
    if (Number(this.fromOTCAmount) > Number(this.anxWallet.wallet_amount)) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.youDontHaveSufficientBalanceToSend'),
        this.translate.instant('pages.transfer.toastr.otc'));
      return;
    }
    if (!this.otcWallet || !this.otcWallet.toAmount) {
      this.toastrService.danger(this.translate.instant('pages.transfer.toastr.pleaseCheckReceiveAmount'),
        this.translate.instant('pages.transfer.toastr.otc'));
      return;
    }

    // Disabled this check for now
    // if (this.otcWallet.wallet_type === 'BTC' && this.anxWallet.walletDollar < 100) {
    //   this.toastrService.danger('Minimum amount for BTC transfer is $100 for beta version.', 'OTC');
    //   return;
    // }

    this.setOTCAmount();

    Swal.fire({
      title: this.translate.instant('pages.transfer.toastr.otc'),
      text: this.translate.instant('pages.transfer.otcWarnMessage'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (!result.value)
        return;

      const transferObj = {
        'user_wallet': this.otcWallet.id,
        'anx_amount': this.fromOTCAmount,
      };

      this.formSubmitting = true;
      this.httpService.post(transferObj, 'transfer-otc/').subscribe((res?: any) => {
        if (res.status) {
          this.formSubmitting = false;
          this.toastrService.success(this.translate.instant('pages.transfer.toastr.transferSuccessfullyCompleted'),
            this.translate.instant('pages.transfer.toastr.otc'));
          this.httpService.get('anx-price/').subscribe((price) => {
            this.anxWallet.anx_price = Number(price['anx_price']);

            this.httpService.get('asset/').subscribe((data?: any) => {
              const anxData = _.find(data.cryptos, ['name', 'ANX']) || {};
              this.anxWallet.wallet_amount = anxData.quantity || 0;
              this.fromOTCAmount = ShareDataService.toFixedDown(this.anxWallet.wallet_amount, 0);
              this.setOTCAmount();
            });
          });
        } else {
          this.formSubmitting = false;
          this.toastrService.danger(res.message, this.translate.instant('pages.transfer.toastr.otc'));
        }
      }, err => {
        this.formSubmitting = false;
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.transfer.toastr.otc'));
      });
    });
  }
}
