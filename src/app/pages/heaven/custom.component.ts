import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {ShareDataService} from '../../services/share-data.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';

@Component({
  template: `
    <div class="dropdown ghost-dropdown" ngbDropdown>
      <button type="button" class="btn btn-sm" [disabled]="rowData.plan === 'Heaven 30'" ngbDropdownToggle
              style="background-color: transparent;"
              [ngClass]="{
    'btn-success': currentTheme === 'default',
    'btn-primary': currentTheme !== 'default'}">
        {{value}}
      </button>
      <ul class="dropdown-menu" ngbDropdownMenu>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, '90', 'Another Heaven 90')">Another Heaven 90</li>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, '60', 'Another Heaven 60')">Another Heaven 60</li>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, '30', 'Another Heaven 30')">Another Heaven 30</li>
        <li class="dropdown-item" (click)="releaseSettingChange(rowData, 'release', 'Release')">Release</li>
      </ul>
    </div>`
})
export class CustomRendererComponent implements ViewCell {
  private alive = true;
  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object

  currentTheme: string;

  constructor(private themeService: NbThemeService,
              private httpService: HttpService,
              private shareDataService: ShareDataService,
              private toastrService: ToastrService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }
  releaseSettingChange(data, planType, valueType) {
    this.value = valueType;
    const apiData = {
      'hid': data.hid,
      'release_settings': planType,
    };
    this.httpService.put(apiData, 'heaven-release-settings/').subscribe((res?: any) => {
      if (res.status) {
        this.toastrService.success('Release setting saved successfully!', 'Heaven History');
      }
      else {
        this.toastrService.danger(ShareDataService.getErrorMessage(res), 'Heaven History');
      }
    }, (err) => {
      this.toastrService.danger(ShareDataService.getErrorMessage(err), 'Heaven History');
    });
  }
}
