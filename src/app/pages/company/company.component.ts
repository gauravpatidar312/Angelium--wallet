import {Component, OnInit, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {LocalDataSource} from 'ng2-smart-table';
import {environment} from '../../../environments/environment';
import {Browser} from 'leaflet';
import win = Browser.win;

declare let jQuery: any;

@Component({
  selector: 'ngx-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})

export class CompanyComponent implements OnInit, AfterViewInit {
  graphData: any;
  userValue: string = 'today';
  fetchingGraphData: boolean = false;
  isProduction: boolean = environment.production;
  source: LocalDataSource = new LocalDataSource();
  graph_types: any = ['New Users', 'Total Users', 'Heaven Users', 'Heaven Volume', 'Heaven Released', 'Upcoming Release', 'ANX'];
  graph_type: string = 'New Users';
  blankData = {
    'data': [],
    'series': [{
      'name': '',
      'data': [0, 0, 0, 0, 0],
      'xAxis': []
    }]};

  constructor(private httpService: HttpService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
    this.getNewUsers('today');
  }

  ngOnInit() {
  }

  getTotalUsers(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`heaven-all-user-status-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.graphData.yAxisUnit = 'Users';
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
      this.graphData.yAxisUnit = 'Users';
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
      this.graphData.yAxisUnit = 'Users';
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
      this.graphData.yAxisUnit = 'USD';
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
      this.graphData.yAxisUnit = 'USD';
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
      this.graphData.yAxisUnit = 'USD';
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
  }

  getANX(value) {
    jQuery('.fetchingGraphData').height(jQuery('#today').height());
    this.fetchingGraphData = true;
    this.httpService.get(`ANX-reward-graph/?graph_type=${value}`).subscribe((res?: any) => {
      this.graphData = res.data;
      this.graphData.yAxisUnit = 'ANX';
      this.userValue = value;
      this.fetchingGraphData = false;
    }, (err) => {
      this.graphData = this.blankData;
      this.fetchingGraphData = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.company'));
    });
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
    } else if (graphType === 'ANX') {
      this.graph_type = 'ANX';
      this.getANX(this.userValue);
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
    else if (this.graph_type === 'ANX')
      this.getANX(value);
  }

  ngAfterViewInit() {
    jQuery('ul.rewardLine li a').click(function (e) {
      jQuery('ul.rewardLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });
  }
}
