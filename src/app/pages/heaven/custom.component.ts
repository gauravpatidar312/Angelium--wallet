import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  template: `
    <div class="dropdown ghost-dropdown" ngbDropdown>
      <button type="button" class="btn btn-sm" ngbDropdownToggle
              style="background-color: transparent;"
              [ngClass]="{
    'btn-success': currentTheme === 'default',
    'btn-primary': currentTheme !== 'default'}">
        {{value}}
      </button>
      <ul class="dropdown-menu" ngbDropdownMenu>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, '30', rowData.plan === 'Heaven 30' ? 'Heaven 30' : 'Another Heaven 30')">{{rowData.plan === 'Heaven 30' ? '' : 'Another'}} Heaven 30</li>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, '60', rowData.plan === 'Heaven 30' ? 'Heaven 60' : 'Another Heaven 60')">{{ rowData.plan === 'Heaven 30' ? '' : 'Another'}} Heaven 60</li>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, '90', rowData.plan === 'Heaven 30' ? 'Heaven 90' : 'Another Heaven 90')">{{rowData.plan === 'Heaven 30' ? '' : 'Another'}} Heaven 90</li>
        <li class="dropdown-item" *ngIf="currentDate < releaseDate" (click)="releaseSettingChange(rowData, 'release', 'Stop')">Stop</li>
        <li class="dropdown-item" *ngIf="currentDate >= releaseDate" (click)="releaseSettingChange(rowData, 'release', 'Release')">Release</li>
      </ul>
    </div>`
})
export class CustomRendererComponent implements ViewCell, OnInit{
  private alive = true;
  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object
  currentDate: any;
  releaseDate: any;
  currentTheme: string;

  constructor(private themeService: NbThemeService,
              private httpService: HttpService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService,
              private translate:TranslateService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit() {
    this.currentDate = moment();
    this.releaseDate = moment(this.rowData.release_date, 'YYYY.MM.DD');
    this.value = (this.currentDate < this.releaseDate && this.value === 'Release') ? 'Stop' : this.value;
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
      }
      else {
        this.toastrService.danger(ShareDataService.getErrorMessage(res), this.translate.instant('pages.heaven.heavenHistory'));
      }
    }, (err) => {
      this.toastrService.danger(ShareDataService.getErrorMessage(err), this.translate.instant('pages.heaven.heavenHistory'));
    });
  }
}
