import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-chart-panel-summary',
  styleUrls: ['./chart-panel-summary.component.scss'],
  template: `
    <div class="summary-container">
      <div class="summary" *ngFor="let item of summary">
        <div class="title">{{ item.title }}</div>
        <div class="value"><span class="text-success">$</span>{{ item.value }}</div>
        <div class="ernpercentage"><span class="caret"><i class="fa fa-caret-up"></i></span>4%</div>
      </div>
    </div>
  `,
})
export class ChartPanelSummaryComponent {
  @Input() summary: {title: string; value: number}[];
}

