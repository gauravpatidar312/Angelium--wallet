import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  template: `
  <div class="dropdown ghost-dropdown" ngbDropdown>
  <button type="button" class="btn btn-sm" ngbDropdownToggle style="background-color: transparent;"  
  [ngClass]="{
    'btn-success': currentTheme === 'default',
    'btn-primary': currentTheme !== 'default'}">
    {{value}}
  </button>
  <ul class="dropdown-menu" ngbDropdownMenu>
    <li class="dropdown-item" (click)="releaseSettingChange(rowData)">Another Heaven 90</li>
    <li class="dropdown-item" (click)="releaseSettingChange(rowData)">Another Heaven 60</li>
    <li class="dropdown-item" (click)="releaseSettingChange(rowData)">Another Heaven 30</li>
    <li class="dropdown-item" (click)="releaseSettingChange(rowData)">Release</li>
  </ul>
</div>
  `
})
export class CustomRendererComponent implements ViewCell {
  private alive = true;
  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object

  currentTheme: string;
  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  releaseSettingChange(data) {
    console.log('Row data', data);
  }
}
