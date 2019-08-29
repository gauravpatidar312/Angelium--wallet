import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {LocalDataSource} from 'ng2-smart-table';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-ticket-master',
  templateUrl: './ticket-master.component.html',
  styleUrls: ['./ticket-master.component.scss']
})

export class TicketMasterComponent implements OnInit {
  fetchingTicketList: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  settings = {
    actions: false,
    editable: false,
    noDataMessage: this.translate.instant('pages.xticket.noTicketPurchased'),
    columns: {
      ticket_id: {
        title: this.translate.instant('pages.xticket.ticketId'),
        type: 'string',
      },
      issued_date: {
        title: this.translate.instant('pages.xticket.purchaseDate'),
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `${moment(cell).format('YYYY.MM.DD')}`;
        },
      },
      ticket_type: {
        title: this.translate.instant('pages.xticket.type'),
        type: 'string',
      },

      name: {
        title: this.translate.instant('common.name'),
        type: 'string',
      },
      holder: {
        title: this.translate.instant('pages.xticket.holderUser'),
        type: 'string',
      },
      buyer: {
        title: this.translate.instant('pages.xticket.buyerUser'),
        type: 'string',
      },
    },
  };

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.getTicketsList();
  }

  getTicketsList() {
    this.fetchingTicketList = true;
    this.httpService.get('ticket-list/?event_id=1').subscribe((res?: any) => {
      if (res) {
        this.source.load(_.orderBy(res, ['issued_date'], ['desc']));
        this.fetchingTicketList = false;
      } else {
        this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.xticketMaster'));
      }
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.xticketMaster'));
    });
  }
}
