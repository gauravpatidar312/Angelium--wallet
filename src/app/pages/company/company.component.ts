import {Component, OnInit, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SmartTableData} from '../../@core/data/smart-table';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {LocalDataSource} from 'ng2-smart-table';
import {LogIn, LogInFailure, SetUserProfile} from '../../@core/store/actions/user.action';
import {Store} from '@ngrx/store';
import {AppState} from '../../@core/store/app.state';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {Browser} from 'leaflet';
import win = Browser.win;

declare let jQuery: any;

@Component({
  selector: 'ngx-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})

export class CompanyComponent implements OnInit, AfterViewInit {
  anxData: any = {};
  graphData: any;
  userValue: string = 'today';
  fetchingGraphData: boolean = false;
  isProduction: boolean = environment.production;
  fetchingUsers: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  graph_types: any = ['New Users', 'Total Users', 'Heaven Users', 'Heaven Volume', 'Heaven Released', 'Upcoming Release', 'ANX Reward'];
  graph_type: string = 'New Users';
  blankData = {
    'data': [],
    'series': [{
      'name': '',
      'data': [0, 0, 0, 0, 0],
      'xAxis': []
    }]};
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: true,
    },
    editable: false,
    noDataMessage: this.translate.instant('pages.hq.thereAreNoUsers'),
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
    this.getAnxStatus();
    this.getNewUsers('today');
  }

  ngOnInit() {
  }

  getTotalUsers(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`heaven-all-user-status-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getNewUsers(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`heaven-user-status-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getHeavenUser(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`heaven-plan-user-status-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getHeavenVolume(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`heaven-plan-status-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getHeavenReleased(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`heaven-released-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getUpcomingRelease(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`new-heaven-release-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getANXReward(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`ANX-reward-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
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
    this.httpService.get(`users/?limit=10000`).subscribe((res?: any) => {
      if (res && res.results) {
        this.source.load(res.results);
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
    if (window.confirm(this.translate.instant('pages.hq.areYouSureToLoadTheSessionOfTheUser'))) {
      const data = {'user_id': event.data.id};
      this.httpService.post(data, 'admin_login/').subscribe((res?: any) => {
        if (res.token) {
          this.store.dispatch(new SetUserProfile({token: res.token}));
          setTimeout(() => {
            this.router.navigateByUrl('/pages/setting');
          }, 10);
        } else if (res.message) {
          this.toastrService.danger(res.message, this.translate.instant('pages.hq.toastr.loadUserSession'));
        }
      }, (err) => {
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.hq.toastr.loadUserSession'));
      });
    }
    event.confirm.reject();
  }

  changeGraph(graphType) {
    if (graphType === 'Total Users') {
      this.graph_type = 'Total Users';
      this.getTotalUsers(this.userValue);
    } else if (graphType === 'New Users') {
      this.graph_type = 'New Users';
      this.getNewUsers(this.userValue);
    } else if (graphType === 'Heaven Users') {
      this.graph_type = 'Heaven Users';
      this.getHeavenUser(this.userValue);
    } else if (graphType === 'Heaven Volume') {
      this.graph_type = 'Heaven Volume';
      this.getHeavenVolume(this.userValue);
    } else if (graphType === 'Heaven Released') {
      this.graph_type = 'Heaven Released';
      this.getHeavenReleased(this.userValue);
    } else if (graphType === 'Upcoming Release') {
      this.graph_type = 'Upcoming Release';
      this.getUpcomingRelease(this.userValue);
    } else if (graphType === 'ANX Reward') {
      this.graph_type = 'ANX Reward';
      this.getANXReward(this.userValue);
    }
  }

  changeType(value) {
    if (this.graph_type === 'Total Users')
      this.getTotalUsers(value);
    else if (this.graph_type === 'New Users')
      this.getNewUsers(value);
    else if (this.graph_type === 'Heaven Users')
      this.getHeavenUser(value);
    else if (this.graph_type === 'Heaven Volume')
      this.getHeavenVolume(value);
    else if (this.graph_type === 'Heaven Released')
      this.getHeavenReleased(value);
    else if (this.graph_type === 'Upcoming Release')
      this.getUpcomingRelease(value);
    else if (this.graph_type === 'ANX Reward')
      this.getANXReward(value);
  }

  ngAfterViewInit() {
    jQuery('ul.rewardLine li a').click(function (e) {
      jQuery('ul.rewardLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }
}
