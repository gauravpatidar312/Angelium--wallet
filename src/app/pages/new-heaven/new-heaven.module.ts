import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewHeavenComponent } from './new-heaven.component';
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
import { TranslateModule } from '@ngx-translate/core';
import {StatusCardComponent} from './status-card/status-card.component';
import {StatusCardFrontComponent} from './status-card/front-side/status-card-front.component';
import {StatusCardBackComponent} from './status-card/back-side/status-card-back.component';
import {ReleaseSettingOneComponent} from './releaseSettingOne.component';
import {ReleaseSettingComponent} from './releaseSetting.component';

@NgModule({
  declarations: [
    NewHeavenComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    OrdersChartComponent,
    ProfitChartComponent,
    ECommerceLegendChartComponent,
    SolarComponent,
    ReleaseSettingComponent,
    ReleaseSettingOneComponent,
    StatusCardComponent,
    StatusCardFrontComponent,
    StatusCardBackComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    TranslateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k',
      libraries: ['places'],
    }),
    LeafletModule.forRoot(),
  ],
  entryComponents: [ReleaseSettingComponent, ReleaseSettingOneComponent]
})
export class NewHeavenModule { }
