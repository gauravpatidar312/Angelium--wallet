import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { NgTableComponent } from './table/ng-table.component';
// import { NgTableFilteringDirective } from './table/ng-table-filtering.directive';
// import { NgTablePagingDirective } from './table/ng-table-paging.directive';
// import { NgTableSortingDirective } from './table/ng-table-sorting.directive';

import { AngelComponent } from './angel.component';
import { EarningCardComponent } from './earning-card/earning-card.component';
import { EarningCardBackComponent } from './earning-card/back-side/earning-card-back.component';
import { EarningCardFrontComponent } from './earning-card/front-side/earning-card-front.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EarningPieChartComponent } from './earning-card/back-side/earning-pie-chart.component';
import { ChartModule } from 'angular2-chartjs';
import { ThemeModule } from '../../@theme/theme.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { EarningLiveUpdateChartComponent } from './earning-card/front-side/earning-live-update-chart.component';
import { EchartsPieComponent } from './echarts/echarts-pie.component';
import { EchartsAreaStackComponent } from './echarts/echarts-area-stack.component';
import { AgmCoreModule } from '@agm/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BubbleMapComponent } from './bubble/bubble-map.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ECommerceChartsPanelComponent } from './charts-panel/charts-panel.component';
import { RewardChartComponent } from './charts-panel/charts/rewards-chart.component';
import { HeavenChartComponent } from './charts-panel/charts/heaven-chart.component';
import { ChartPanelHeaderComponent } from './charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './charts-panel/chart-panel-summary/chart-panel-summary.component';
import { ECommerceLegendChartComponent } from './legend-chart/legend-chart.component';


import {
  MatToolbarModule,
  MatTableModule,
} from '@angular/material';

@NgModule({
  declarations: [AngelComponent,
    EarningCardComponent,
    EarningCardBackComponent,
    EarningCardFrontComponent,
    EarningPieChartComponent,
    EarningLiveUpdateChartComponent,
    EchartsPieComponent,
    EchartsAreaStackComponent,
    BubbleMapComponent,
    StatusCardComponent,
    ECommerceChartsPanelComponent,
    RewardChartComponent,
    HeavenChartComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    ECommerceLegendChartComponent,
    ],
  imports: [
    MatToolbarModule,
    MatTableModule,
    CommonModule,
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    Ng2SmartTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k',
      libraries: ['places'],
    }),
    LeafletModule.forRoot(),
  ]
})
export class AngelModule { }
