import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';
import {ShareDataService} from '../../services/share-data.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

declare let jQuery: any;

@Component({
  template: `
    <div class="pointer" *ngIf="(rowData.transaction_type === 'stop' && value === 'Release' && !rowData.showDropdown)">
      <button type="button" (click)="onReleaseSetting(rowData)" class="btn release-btn btn-sm btn-success">
        <span *ngIf="!fetchHeavenRelease">Release</span>
        <span *ngIf="fetchHeavenRelease"><i class="fa fa-spinner fa-spin text-white"></i></span>
      </button>
    </div>
    <div class="dropdown ghost-dropdown"
         *ngIf="!(rowData.transaction_type === 'stop' && value === 'Release' && !rowData.showDropdown)" ngbDropdown>
      <button type="button" class="btn btn-sm btn-primary" ngbDropdownToggle style="background-color: transparent;">
        {{value}}
      </button>
      <ul class="dropdown-menu" ngbDropdownMenu>
        <li class="dropdown-item"
            (click)="releaseSettingChange(rowData, '30', rowData.plan === 'Heaven 30' ? 'Heaven 30' : 'Another Heaven 30')">
          {{rowData.plan === 'Heaven 30' ? '' : 'Another'}} {{"common.heaven" | translate}} 30
        </li>
        <li class="dropdown-item"
            (click)="releaseSettingChange(rowData, '60', rowData.plan === 'Heaven 30' ? 'Heaven 60' : 'Another Heaven 60')">
          {{ rowData.plan === 'Heaven 30' ? '' : 'Another'}} {{"common.heaven" | translate}} 60
        </li>
        <li class="dropdown-item"
            (click)="releaseSettingChange(rowData, '90', rowData.plan === 'Heaven 30' ? 'Heaven 90' : 'Another Heaven 90')">
          {{rowData.plan === 'Heaven 30' ? '' : 'Another'}} {{"common.heaven" | translate}} 90
        </li>
        <li class="dropdown-item" *ngIf="currentDate < releaseDate"
            (click)="releaseSettingChange(rowData, 'release', 'Stop')">Stop
        </li>
        <li class="dropdown-item" *ngIf="currentDate >= releaseDate"
            (click)="releaseSettingChange(rowData, 'release', 'Release')">Release
        </li>
      </ul>
    </div>`
})

export class CustomRendererComponent implements ViewCell, OnInit {
  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object
  @Output() onReleaseFailed: EventEmitter<any> = new EventEmitter();
  @Output() onReleaseSaved: EventEmitter<any> = new EventEmitter();
  currentDate: any;
  releaseDate: any;
  user: any;
  fetchHeavenHistory: boolean = false;
  fetchHeavenRelease: boolean = false;

  constructor(private httpService: HttpService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private sessionStorage: SessionStorageService) {
    this.user = this.sessionStorage.getFromSession('userInfo');
  }

  ngOnInit() {
    this.currentDate = moment().startOf('day');
    this.releaseDate = moment(this.rowData.release_date, 'YYYY.MM.DD');
    this.value = (this.currentDate < this.releaseDate && this.rowData.release_settings === 'Release') ? 'Stop' : this.value;
  }

  releaseSettingChange(data, planType, valueType) {
    this.value = valueType;
    const apiData = {
      'hid': data.hid,
      'release_settings': planType,
    };
    this.httpService.put(apiData, 'heaven-release-settings/').subscribe((res?: any) => {
      if (res.status) {
        this.toastrService.success(this.translate.instant('pages.heaven.toastr.releaseSettingSavedSuccessfully'),
          this.translate.instant('pages.heaven.heavenHistory'));
      } else {
        this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('pages.heaven.heavenHistory'));
      }
    }, (err) => {
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.heaven.heavenHistory'));
    });
  }

  onReleaseSetting(data) {
    if (!this.user.kyc_info || this.user.kyc_info.status_description !== 'confirmed') {
      this.toastrService.info(this.translate.instant('pages.heaven.toastr.kycNotApproved'), this.translate.instant('pages.heaven.release'));
      return;
    }

    Swal.fire({
      title: this.translate.instant('pages.heaven.release'),
      text: this.translate.instant('pages.heaven.toastr.convertReleaseText'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('pages.swal.yesSure'),
      cancelButtonText: this.translate.instant('pages.swal.cancel')
    }).then((result) => {
      if (!result.value)
        return;
      this.fetchHeavenRelease = true;
      this.httpService.post({heaven_id: data.hid}, 'heaven-release/').subscribe((res?: any) => {
        if (res.status) {
          this.fetchHeavenRelease = false;
          this.toastrService.success(this.translate.instant('pages.heaven.toastr.releaseSettingSavedSuccessfully'),
            this.translate.instant('pages.heaven.release'));
          this.onReleaseSaved.emit(this.rowData);
        } else {
          this.fetchHeavenRelease = false;
          this.rowData.showDropdown = true;
          this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('pages.heaven.release'));
          this.onReleaseFailed.emit(this.rowData);
        }
      }, (err) => {
        this.fetchHeavenRelease = false;
        this.rowData.showDropdown = true;
        this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('pages.heaven.release'));
        this.onReleaseFailed.emit(this.rowData);
      });
    });
  }
}
