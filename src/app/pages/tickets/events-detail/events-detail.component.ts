import {Component, OnInit} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from '../../../services/toastr.service';
import {HttpService} from '../../../services/http.service';
import {ShareDataService} from '../../../services/share-data.service';
import {SessionStorageService} from '../../../services/session-storage.service';
import {ActivatedRoute} from '@angular/router';
import {CustomInputComponent} from './custom-input.component';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'ngx-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.scss']
})

export class EventsDetailComponent implements OnInit {
  eventId: number = null;
  myWallets: string[] = [];
  ticketDetails: any[] = [];
  walletType: string;
  selectedTicket: any;
  wallet: any;
  purchaseAmount: number = null;
  fetchingUsers: boolean = false;
  userInfo: any;
  noOfTickets: number = null;
  buyingTicket: boolean = false;
  fetchingTicketList: boolean = true;

  source: LocalDataSource = new LocalDataSource();
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'download',
          title: '<i class="ion-archive"></i>'
        }
      ]
    },
    editable: false,
    noDataMessage: this.translate.instant('pages.xticket.noTicketPurchased'),
    columns: {
      id: {
        title: this.translate.instant('pages.hq.id'),
        type: 'string',
      },
      name: {
        title: this.translate.instant('common.name'),
        type: 'custom',
        renderComponent: CustomInputComponent,
        onComponentInitFunction: (instance) => {
          instance.onInputChange.subscribe((row) => {
            this.source.update(row, row);
          });
        }
      },
      asset: {
        title: this.translate.instant('common.assets'),
        type: 'string',
      },
      created: {
        title: this.translate.instant('pages.xticket.purchaseDate'),
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `${moment(cell).format('YYYY.MM.DD')}`;
        },
      }
    },
  };

  constructor(public translate: TranslateService,
              private shareDataService: ShareDataService,
              private httpService: HttpService,
              private sessionStorage: SessionStorageService,
              private toastrService: ToastrService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.setUserInfo();
    this.getEventDetails();
    this.getWalletDetails();
  }

  setUserInfo() {
    this.userInfo = this.sessionStorage.getFromSession('userInfo');
  }

  getEventDetails() {
    this.route.params.subscribe((params?: any) => {
      this.eventId = params.id;
    });
    this.httpService.get('event-price-list?event_id=' + this.eventId).subscribe((res?: any) => {
      this.ticketDetails = res.data;
    });
  }

  getWalletDetails() {
    this.httpService.get('user-wallet-address/').subscribe((res?: any) => {
      this.myWallets = res;
      this.purchasedTickets();
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }

  onTicketSelect(ticket) {
    this.selectedTicket = ticket;
  }

  buyTickets() {
    if (!this.selectedTicket || !this.selectedTicket.id) {
      this.toastrService.danger(this.translate.instant('pages.xticket.toastr.pleaseSelectTicket'), this.translate.instant('common.xticket'));
      return;
    }
    this.buyingTicket = true;
    this.purchaseAmount = this.selectedTicket.price * this.noOfTickets;
    this.wallet = _.find(this.myWallets, ['wallet_type', this.walletType]);
    if (this.purchaseAmount > this.wallet.wallet_dollar_amount) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.youDontHaveSufficientBalance'), this.translate.instant('common.xticket'));
      this.buyingTicket = false;
      return;
    }
    const data = {
      'wallet_type': this.walletType,
      'ticket_qty': this.noOfTickets,
      'ticket_id': this.selectedTicket.id,
      'owner_name': this.userInfo.fullname,
      'owner_email': this.userInfo.email,
      'event_id': this.eventId
    };
    this.httpService.post(data, 'user-purchase/').subscribe((res?: any) => {
      this.buyingTicket = false;
      if (res.status) {
        this.toastrService.success(this.translate.instant('pages.xticket.toastr.ticketsPurchased'), this.translate.instant('common.xticket'));
        this.getWalletDetails();
      } else {
        this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticket'));
      }
    }, (err) => {
      this.buyingTicket = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }

  onDownloadTicket(event): void {
    const ticket = event.data;
    if (!ticket.name && !ticket.newName) {
      this.toastrService.danger(this.translate.instant('pages.xticket.toastr.pleaseEnterName'), this.translate.instant('common.xticket'));
      return;
    }
    if (ticket.name) {
      this.downloadTicket(ticket);
      return;
    }

    if (!ticket.newName.match(/^[a-zA-Z0-9!@#$%^_+\-\[\]~:|.]*$/g)) {
      this.toastrService.danger(this.translate.instant('pages.register.enterValueInEnglish'), this.translate.instant('common.xticket'));
      return;
    }

    const data = {
      'purchase_id': ticket.id,
      'name': ticket.newName
    };
    this.httpService.put(data, 'xticket-update/')
      .subscribe((res?: any) => {
        if (res.status) {
          this.source.refresh();
          this.downloadTicket(ticket);
        } else {
          this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticket'));
        }
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }

  downloadTicket(ticket) {
    const link = document.createElement('a');
    link.href = ticket.qrcode;
    link.target = '_blank';
    link.setAttribute('visibility', 'hidden');
    link.download = `${ticket.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  purchasedTickets() {
    this.fetchingTicketList = true;
    this.httpService.get(`xticket-list/?event_id=${this.eventId}`).subscribe((res?: any) => {
      res.map((ticket: any) => {
        const wallet = _.findLast(this.myWallets, (item: any) => {
          return item.id === ticket.wallet_address;
        });
        ticket.asset = wallet.wallet_type;
      });
      this.source.load(res);
      this.fetchingTicketList = false;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }
}
