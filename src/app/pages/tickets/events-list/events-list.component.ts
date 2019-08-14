import {Component, OnInit} from '@angular/core';
import {SmartTableData} from '../../../@core/data/smart-table';
import {TranslateService} from '@ngx-translate/core';
import {LocalDataSource} from 'ng2-smart-table';
import {HttpService} from '../../../services/http.service';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {ToastrService} from '../../../services/toastr.service';
import {ShareDataService} from '../../../services/share-data.service';
import {AppState} from '../../../@core/store/app.state';

declare let jQuery: any;

@Component({
  selector: 'ngx-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})

export class EventsListComponent implements OnInit {
  anxData: any = {};
  fetchingUsers: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: true,
    },
    editable: false,
    noDataMessage: this.translate.instant('pages.xticket.thereAreNoEvents'),
    delete: {
      deleteButtonContent: `<span class="cell-font">${this.translate.instant('common.detail')}</span>`,
      confirmDelete: true,
    },
    columns: {
      id: {
        title: this.translate.instant('pages.hq.id'),
        type: 'string',
      },
      title: {
        title: this.translate.instant('common.title'),
        type: 'string',
      },
      description: {
        title: this.translate.instant('common.description'),
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<div class="content-control">${cell}</div>`;
        },
      },
      status: {
        title: this.translate.instant('common.status'),
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<div>${cell}</div>`;
        },
      }
    },
  };

  constructor(private service: SmartTableData,
              public translate: TranslateService,
              private httpService: HttpService,
              private store: Store<AppState>,
              private router: Router,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService) {
    this.getUsersList();
    this.getAnxStatus();
  }

  ngOnInit() {
  }

  getAnxStatus() {
    this.httpService.get(`anx_status/`).subscribe((res?: any) => {
      if (res.status) {
        this.anxData = res.data;
      }
    });
  }

  getUsersList() {
    jQuery('.user-database-spinner').height(jQuery('#card-user-database').height());
    this.fetchingUsers = true;
    this.httpService.get('events-list/').subscribe((res?: any) => {
      if (res.data) {
        this.source.load(res.data);
      } else if (res.message) {
        this.toastrService.danger(res.message, this.translate.instant('pages.hq.toastr.userDatabase'));
      }
      this.fetchingUsers = false;
    }, (err) => {
      this.fetchingUsers = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.hq.toastr.userDatabase'));
    });
  }

  onLoadConfirm(event): void {
    this.router.navigate(['pages/xticket/' + event.id]);
  }
}
