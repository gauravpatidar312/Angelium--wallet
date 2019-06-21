import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeavenComponent } from './heaven.component';
import { ECommerceChartsPanelComponent } from './charts-panel/charts-panel.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AgmCoreModule } from '@agm/core';
import { ThemeModule } from '../../@theme/theme.module';
import { OrdersChartComponent } from './charts-panel/charts/orders-chart.component';
import { ChartPanelHeaderComponent } from './charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './charts-panel/chart-panel-summary/chart-panel-summary.component';
import { ECommerceLegendChartComponent } from './legend-chart/legend-chart.component';
import { ProfitChartComponent } from './charts-panel/charts/profit-chart.component';
import { ChartModule } from 'angular2-chartjs';
import { SolarComponent } from './solar/solar.component';
import { CustomRendererComponent } from './custom.component';


@NgModule({
  declarations: [
    HeavenComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    OrdersChartComponent,
    ProfitChartComponent,
    ECommerceLegendChartComponent,
    SolarComponent,
    CustomRendererComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k',
      libraries: ['places'],
    }),
    LeafletModule.forRoot(),
  ],
  entryComponents: [CustomRendererComponent]
})

export class HeavenModule { }
