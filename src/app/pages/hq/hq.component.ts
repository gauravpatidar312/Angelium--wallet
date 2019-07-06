import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {SmartTableData} from '../../@core/data/smart-table';
import {ShareDataService} from "../../services/share-data.service";
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {LocalDataSource} from "ng2-smart-table";
import {LogIn, LogInFailure, SetUserProfile} from "../../@core/store/actions/user.action";
import {Store} from "@ngrx/store";
import {AppState} from "../../@core/store/app.state";
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {Browser} from "leaflet";
import win = Browser.win;

declare let jQuery: any;

@Component({
  selector: 'ngx-hq',
  templateUrl: './hq.component.html',
  styleUrls: ['./hq.component.scss'],
})

export class HQComponent implements OnInit {
  isProduction: boolean = environment.production;
  fetchingUsers: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: true,
    },
    editable: false,
    noDataMessage: 'There are no users.',
    /*add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },*/
    delete: {
      deleteButtonContent: '<i class="nb-checkmark"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: this.translate.instant('pages.hq.id'),
        type: 'string',
      },
      first_name: {
        title: this.translate.instant('common.firstName'),
        type: 'string',
      },
      last_name: {
        title: this.translate.instant('common.lastName'),
        type: 'string',
      },
      username: {
        title: this.translate.instant('common.username'),
        type: 'string',
      },
      email: {
        title: this.translate.instant('pages.setting.eMail'),
        type: 'string',
      },
      phone: {
        title: this.translate.instant('common.phone'),
        type: 'string',
      },
    },
  };

  constructor(private service: SmartTableData,
              private httpService: HttpService,
              private toastrService: ToastrService,
              private store: Store<AppState>,
              private router: Router,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
    this.getUsersList();
  }

  ngOnInit() {
  }

  getUsersList() {
    jQuery('.user-database-spinner').height(jQuery('#card-user-database').height());
    this.fetchingUsers = true;
    this.httpService.get(`users/?limit=10000`).subscribe((res?: any) => {
      if (res && res.results) {
        this.source.load(res.results);
      } else if (res.message) {
        this.toastrService.danger(res.message, 'User Database');
      }
      this.fetchingUsers = false;
    }, (err) => {
      this.fetchingUsers = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'User Database');
    });
  }

  onLoadConfirm(event): void {
    if (window.confirm('Are you sure to load the session of the user?')) {
      const data = {'user_id': event.data.id};
      this.httpService.post(data, 'admin_login/').subscribe((res?: any) => {
        if (res.token) {
          this.store.dispatch(new SetUserProfile({ token: res.token }));
          this.router.navigateByUrl('/pages/setting').then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 250);
          });
        } else if (res.message) {
          this.toastrService.danger(res.message, 'Load User Session');
        }
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), 'Load User Session');
      });
    }
    event.confirm.reject();
  }
}
