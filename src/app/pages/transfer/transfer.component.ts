import {Component, OnInit} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';
import {ShareDataService} from '../../services/share-data.service';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from '../../services/toastr.service';
import {ActivatedRoute} from '@angular/router';

declare const jQuery: any;
@Component({
  selector: 'ngx-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  private alive = true;
  sendForm: FormGroup;
  sendType: string = 'BTC';
  receiveType: string = 'BTC';
  fromType: string = 'ANX';
  toType: string = 'BTC';
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
  myWallets: any;
  sendWallet: any;
  receiveWallet: any;
  anxWallet: any = {};
  otcWallet: any = {};
  fromOTCAmount: number;

  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
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
      this.onChangeWallet(this.shareDataService.transferTitle, this.shareDataService.transferTab.toLowerCase());
      this.shareDataService.transferTab = null;
      this.shareDataService.transferTitle = null;
    }

    this.sendForm = this.formBuilder.group({
      transfer_amount: ['', Validators.required],
    });
  }

  get f() {
    return this.sendForm.controls;
  }

  getWallets() {
    this.httpService.get('user-wallet-address/').subscribe((res) => {
      this.myWallets = res;
      this.sendWallet = this.myWallets.find(item => {
        return item.wallet_type === 'BTC';
      });
      if (this.sendWallet) {
        this.setAmount('BTC');
        this.receiveWallet = {...this.sendWallet};
        this.otcWallet = {...this.sendWallet};
      } else {
        this.sendType = 'SELECT';
        this.receiveType = 'SELECT';
        this.toType = 'SELECT';
      }
    });

    this.httpService.get('get-total-anx/').subscribe((data) => {
      this.anxWallet.wallet_amount = data['total-anx'];
    });
    this.httpService.get('anx-price/').subscribe((data) => {
      this.anxWallet.anx_price = Number(data['anx_price']);
    });
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
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
    });
  }

  setOTCAmount() {
    if (!this.fromOTCAmount) {
      this.otcWallet.walletDollar = 0;
      return;
    }

    this.fetchingAmount = true;
    this.anxWallet.walletDollar = this.fromOTCAmount * this.anxWallet.anx_price;

    const toWallet = this.myWallets.find(item => {
      return item.wallet_type === this.toType;
    });

    const obj = {
      'dollar_amount': this.anxWallet.walletDollar,
      'crypto_currency_code': toWallet.id.toString(),
    };

    // TODO: need to complete
    this.httpService.post(obj, 'convert_to_crypto/').subscribe((data?: any) => {
      if (data.ERROR || data.Error) {
        this.fetchingAmount = false;
        this.toastrService.danger(data.ERROR || data.Error, 'Fetching Amount');
        return;
      }
      let convert = data;

      this.httpService.get('live-price/').subscribe(data => {
        this.otcWallet.toAmount = data[this.toType];
        this.otcWallet.toDollar = Number(this.fromOTCAmount) * data['ANX'];
        this.fetchingAmount = false;
      }, (err) => {
        this.fetchingAmount = false;
        this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
      });
    }, (err) => {
      this.fetchingAmount = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Fetching Amount');
    });
  }

  onChangeWallet(walletType: string, typeValue): void {
    if (typeValue === 'send') {
      this.sendType = walletType;
      this.sendWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
      this.sendForm.value.transfer_amount = this.sendWallet.wallet_amount;
      this.setAmount(walletType);
    }
    else if (typeValue === 'receive') {
      this.receiveType = walletType;
      this.receiveWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
    } else if (typeValue === 'from') {
      this.fromType = walletType;
      // this.setOTCAmount();
    } else if (typeValue === 'to') {
      this.toType = walletType;
      this.otcWallet = this.myWallets.find(item => {
        return item.wallet_type === walletType;
      });
      this.setOTCAmount();
    }
  }

  onSendTransfer() {
    if (!this.sendForm.value || !this.sendForm.value.transfer_amount || !Number(this.sendForm.value.transfer_amount)) {
      this.toastrService.danger('Please enter transfer amount.', 'Send');
      return;
    }

    if (Number(this.sendForm.value.transfer_amount) > Number(this.sendWallet.wallet_amount)) {
      this.toastrService.danger('You don\'t have sufficient balance to send.', 'Send');
      return;
    }

    const transferObj = {
      'user_wallet': this.sendWallet.id,
      'destination_address': this.sendWallet.address,
      'transfer_amount': Number(this.sendForm.value.transfer_amount),
    };

    this.formSubmitting = true;
    this.httpService.post(transferObj, 'transfer/').subscribe((res?: any) => {
      if (res.status) {
        this.formSubmitting = false;
        this.toastrService.success('Transfer successfully completed!', 'Send');
        this.httpService.get('user-wallet-address/').subscribe((data?: any) => {
          this.myWallets = data;
        });
      } else {
        this.formSubmitting = false;
        this.toastrService.danger(res.message, 'Send');
      }
    }, (err) => {
      this.formSubmitting = false;
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Send');
    });
  }

  onOTCTransfer() {
    if (!this.fromOTCAmount || !Number(this.fromOTCAmount)) {
      this.toastrService.danger('Please enter transfer amount.', 'OTC');
      return;
    }
    if (Number(this.fromOTCAmount) > Number(this.otcWallet.wallet_amount)) {
      this.toastrService.danger('You don\'t have sufficient balance to send.', 'OTC');
      return;
    }
    if (!this.otcWallet || !this.otcWallet.toAmount) {
      this.toastrService.danger('Please check receive amount.', 'OTC');
      return;
    }

    /*
    const transferObj = {
      'user_wallet': this.otcWallet.id,
      'transfer_amount': this.otcWallet.wallet_amount,
      'anx_amount': this.otcWallet.wallet_amount,
    };
    this.formSubmitting = true;
    this.httpService.post(transferObj, 'transfer-otc/').subscribe((res?: any) => {
      if (res.status) {
        this.toastrService.success('Transfer successfully!', 'Send Transfer');
      } else {
        this.toastrService.danger(res.message, 'Send Transfer');
      }
    }, err => {
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Send Transfer');
    });
    */
  }
}
