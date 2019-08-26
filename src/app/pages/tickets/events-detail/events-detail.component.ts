import {Component, OnInit} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from '../../../services/toastr.service';
import {HttpService} from '../../../services/http.service';
import {ShareDataService} from '../../../services/share-data.service';
import {SessionStorageService} from '../../../services/session-storage.service';
import {ActivatedRoute} from '@angular/router';
import {CustomInputComponent} from './custom-input.component';
import {NbDialogService} from '@nebular/theme';
import {DeviceDetectorService} from 'ngx-device-detector';

import * as _ from 'lodash';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
declare let jQuery: any;

@Component({
  selector: 'ngx-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.scss']
})

export class EventsDetailComponent implements OnInit {
  eventId: number = null;
  eventDetail: any;
  myWallets: any;
  ticketTypes: any;
  selectedTicket: any;
  selectedWallet: any;
  maxAmount: number;
  fetchingUsers: boolean = false;
  userInfo: any;
  noOfTickets: number = null;
  buyingTicket: boolean = false;
  downloadingTicket: boolean = false;
  mailingTicket: boolean = false;
  sendingTicket: boolean = false;
  fetchingTicketList: boolean = true;
  hasNoTickets: boolean = false;
  ticketData: any;
  totalAmount: number;
  fetchingAmount: boolean = false;
  deviceInfo: any;
  sendUsername: string;

  source: LocalDataSource = new LocalDataSource();
  settings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          width: '60px',
          display: 'inline-table',
          name: 'download',
          title: '<i class="ion-archive"></i>'
        },
        {
          width: '60px',
          display: 'inline-table',
          name: 'send',
          title: '<i class="fas fa-share-square"></i>'
        }
      ]
    },
    editable: false,
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
      ticket_name: {
        title: this.translate.instant('common.ticket'),
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
              private dialogService: NbDialogService,
              private route: ActivatedRoute,
              private deviceService: DeviceDetectorService) {
  }

  ngOnInit() {
    this.setUserInfo();
    this.getEventDetails();
    this.getWalletDetails();
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  setUserInfo() {
    this.userInfo = this.sessionStorage.getFromSession('userInfo');
  }

  getEventDetails() {
    this.route.params.subscribe((params?: any) => {
      this.eventId = params.id;
      this.httpService.get('events-list/?event_id=' + this.eventId).subscribe((res?: any) => {
        if (res.data) {
          this.eventDetail = res.data;
        } else if (res.message) {
          this.toastrService.danger(res.message, this.translate.instant('common.xticket'));
        }
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
      });
    });
    this.httpService.get('event-price-list/?event_id=' + this.eventId).subscribe((res?: any) => {
      this.ticketTypes = res.data;
    });
  }

  getWalletDetails() {
    this.httpService.get('user-wallet-address/').subscribe((res?: any) => {
      const walletData = _.filter(res, (wallet?: any) => {
        wallet.title = wallet.wallet_type;
        if (wallet.wallet_type === 'USDT')
          wallet.title = 'USDT (OMNI)';
        else if (wallet.wallet_type === 'ERCUSDT')
          wallet.title = 'USDT (ERC20)';
        return wallet.wallet_type !== 'ANX';
      });
      this.myWallets = _.orderBy(walletData, ['title']);
      this.purchasedTickets();
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }

  onTicketSelect(ticket) {
    this.selectedTicket = ticket;
    this.setAmount();
  }

  setWalletType(wallet) {
    this.selectedWallet = wallet;
    this.maxAmount = ShareDataService.toFixedDown(this.selectedWallet.wallet_amount, 6);
    this.setAmount();
  }

  onBuyTickets() {
    if (!this.selectedTicket || !this.selectedTicket.id) {
      this.toastrService.danger(this.translate.instant('pages.xticket.toastr.pleaseSelectTicket'), this.translate.instant('common.xticket'));
      return;
    }
    if ((this.selectedTicket.price * this.noOfTickets) > this.selectedWallet.wallet_dollar_amount) {
      this.toastrService.danger(this.translate.instant('pages.heaven.toastr.youDontHaveSufficientBalance'), this.translate.instant('common.xticket'));
      return;
    }

    let validateEndpoint = '';
    if (this.selectedWallet.wallet_type === 'BTC')
      validateEndpoint = 'validate_btc/';
    else if (this.selectedWallet.wallet_type === 'USDT')
      validateEndpoint = 'validate_usdt/';
    if (validateEndpoint) {
      this.httpService.post({'amount': Number(this.totalAmount)}, validateEndpoint).subscribe((res?: any) => {
        if (res.status)
          this.buyTickets();
        else
          this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticket'));
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
      });
    } else
      this.buyTickets();
  }

  buyTickets() {
    const data = {
      'wallet_type': this.selectedWallet.wallet_type,
      'ticket_qty': this.noOfTickets,
      'ticket_id': this.selectedTicket.id,
      'owner_name': this.userInfo.fullname,
      'owner_email': this.userInfo.email,
      'event_id': this.eventId
    };
    this.buyingTicket = true;
    this.httpService.post(data, 'user-purchase/').subscribe((res?: any) => {
      this.buyingTicket = false;
      if (res.status) {
        this.noOfTickets = null;
        this.selectedTicket = null;
        this.selectedWallet = null;
        this.totalAmount = null;
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


  urlToBase64(url, callback) {
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      const raw = String.fromCharCode.apply(null, new Uint8Array(this.response));
      callback(raw ? ('data:image/jpeg;base64,' + btoa(raw)) : '');
    };
    xmlHTTP.send();
  }

  openDownloadModal(template) {
    this.urlToBase64(this.ticketData.qrcode, (base64) => {
      if (base64)
        this.ticketData.qrcode = base64;
    });

    this.dialogService.open(template, {
      autoFocus: true
    });
  }

  onCustomAction(event, template: any, sendTicketTemplate: any): void {
    if (event.action === 'send') {
      this.ticketData = event.data;
      this.sendUsername = '';
      this.dialogService.open(sendTicketTemplate, {
        autoFocus: true
      });
    } else {
      const ticket = event.data;
      if (!ticket.name && !ticket.newName) {
        this.toastrService.danger(this.translate.instant('pages.xticket.toastr.pleaseEnterName'), this.translate.instant('common.xticket'));
        return;
      }

      this.ticketData = ticket;
      if (ticket.name) {
        this.openDownloadModal(template);
        return;
      }

      if (!ticket.newName.match(/^[a-zA-Z +\-\[\]~:|.]*$/g)) {
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
            this.ticketData.name = ticket.newName;
            this.openDownloadModal(template);
          } else {
            this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticket'));
          }
        }, (err) => {
          this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
        });
    }
  }

  blobToBase64(blob, callback) {
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result.toString();
      callback(dataUrl);
    };
    reader.readAsDataURL(blob);
  }

  downloadTicket(dialog, isEmail?: boolean) {
    this.downloadingTicket = !isEmail;
    this.mailingTicket = isEmail;
    setTimeout(() => {
      const elementToPrint = document.getElementById('img-download');
      if (this.deviceInfo.os === 'iOS') {
        elementToPrint.style.marginTop = '-94px';
      }
      setTimeout(() => {
        html2canvas(elementToPrint, {'scale': 5})
          .then(canvas => {
            const pdf = new jsPDF('p', 'px', [350, 758]);
            // this.ticketData.img = canvas.toDataURL('image/jpeg');
            pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 264, 572);
            if (!isEmail) {
              pdf.setProperties({'title': `Ticket-${this.ticketData.name}.pdf`});
              // Temporary commented.
              /*const pdfData = pdf.output('blob');
               this.blobToBase64(pdfData, (base64) => {
               window.open(base64, '_blank');
               });*/
              pdf.output('dataurlnewwindow');
              this.downloadingTicket = false;
              dialog.close();
            } else {
              const pdfData = pdf.output('blob');
              this.blobToBase64(pdfData, (base64) => {
                const postData: any = {
                  'data': base64.split(',')[1],
                  'name': this.ticketData.name.replace(/^\/+|\/+$/g, '_')
                };
                this.httpService.post(postData, 'email-ticket/').subscribe((res?: any) => {
                  if (res && res.status) {
                    this.mailingTicket = false;
                    dialog.close();
                    this.toastrService.success(this.translate.instant('pages.xticket.toastr.emailHasBeenSent'), this.translate.instant('common.xticket'));
                  } else
                    this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticket'));
                }, (err) => {
                  this.mailingTicket = false;
                  this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
                });
              });
            }
          });
      }, 400);
    }, 0);
  }

  onSendTicket(dialog: any) {
    if (this.ticketData.is_send) {
      this.toastrService.danger(this.translate.instant('pages.xticket.toastr.ticketAlreadySent'), this.translate.instant('common.xticket'));
      return;
    }
    if (!this.sendUsername) {
      this.toastrService.danger(this.translate.instant('pages.setting.toastr.pleaseEnterUsername'), this.translate.instant('common.xticket'));
      return;
    }
    if (!this.sendUsername.match(/^[a-zA-Z0-9!@#$%^_+\-\[\]~:|.]*$/g)) {
      this.toastrService.danger(this.translate.instant('pages.register.enterValueInEnglish'), this.translate.instant('common.xticket'));
      return;
    }

    const data: any = {
      'username': this.sendUsername,
      'user_purchase_id': this.ticketData.id
    };
    this.sendingTicket = true;
    this.httpService.post(data, 'send-ticket/').subscribe((res?: any) => {
      if (res && res.status) {
        this.sendingTicket = false;
        dialog.close();
        this.toastrService.success(this.translate.instant('pages.xticket.toastr.ticketHasBeenSent'), this.translate.instant('common.xticket'));
        this.purchasedTickets();
      } else
        this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticket'));
    }, (err) => {
      this.sendingTicket = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }

  playVideo() {
    jQuery.fancybox.open({
      src: this.eventDetail.video_url
    });
  }

  setAmount() {
    if (!(this.noOfTickets && this.noOfTickets > 0 && this.selectedWallet && this.selectedTicket && this.selectedTicket.id)) {
      this.totalAmount = null;
      return;
    }

    this.fetchingAmount = true;
    this.httpService.get('live-price/').subscribe(data => {
      if (!data[this.selectedWallet.wallet_type])
        this.totalAmount = null;
      else
        this.totalAmount = (this.selectedTicket.price * this.noOfTickets) / data[this.selectedWallet.wallet_type];
      this.fetchingAmount = false;
    }, (err) => {
      this.fetchingAmount = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.fetchingAmount'));
    });
  }

  purchasedTickets() {
    this.fetchingTicketList = true;
    this.httpService.get(`xticket-list/?event_id=${this.eventId}`).subscribe((res?: any) => {
      this.hasNoTickets = !res.length;
      res.map((ticket: any) => {
        const wallet: any = _.findLast(this.myWallets, (item: any) => {
            return item.id === ticket.wallet_address;
          }) || {};
        ticket.asset = wallet.title || 'N/A';
        const ticketType: any = _.findLast(this.ticketTypes, (item: any) => {
            return item.id === ticket.ticket;
          }) || {};
        ticket.ticket_name = ticketType.ticket_name || 'Invitation';
      });
      this.source.load(_.orderBy(res, ['created'], ['desc']));
      this.fetchingTicketList = false;
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticket'));
    });
  }
}
