import {NgModule} from '@angular/core';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TranslateModule} from '@ngx-translate/core';

import {ThemeModule} from '../../@theme/theme.module';
import {DashboardComponent} from './dashboard.component';
import {ECommerceChartsPanelComponent} from './charts-panel/charts-panel.component';
import {OrdersChartComponent} from './charts-panel/charts/orders-chart.component';
import {ProfitChartComponent} from './charts-panel/charts/profit-chart.component';
import {ChartPanelHeaderComponent} from './charts-panel/chart-panel-header/chart-panel-header.component';
import {ChartPanelSummaryComponent} from './charts-panel/chart-panel-summary/chart-panel-summary.component';
import {ChartModule} from 'angular2-chartjs';
import {SecurityCamerasComponent} from './security-cameras/security-cameras.component';
import {LegendChartComponent} from './legend-chart/legend-chart.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {EarningCardComponent} from './earning-card/earning-card.component';
import {EarningCardBackComponent} from './earning-card/back-side/earning-card-back.component';
import {EarningPieChartComponent} from './earning-card/back-side/earning-pie-chart.component';
import {EarningCardFrontComponent} from './earning-card/front-side/earning-card-front.component';
import {EarningLiveUpdateChartComponent} from './earning-card/front-side/earning-live-update-chart.component';
import {CalendarComponent} from '../common-components/calendar/calendar.component';
import {DayCellComponent} from '../common-components/calendar/day-cell/day-cell.component';
import {EchartsPieComponent} from '../common-components/echarts/echarts-pie.component';
import {EchartsAreaStackComponent} from '../common-components/echarts/echarts-area-stack.component';
import {StatusCardComponent} from './status-card/status-card.component';
import {StatusCardFrontComponent} from './status-card/front-side/status-card-front.component';
import {StatusCardBackComponent} from './status-card/back-side/status-card-back.component';
import {TrafficComponent} from './traffic/traffic.component';
import {TrafficChartComponent} from './traffic/traffic-chart.component';
@NgModule({
  imports: [
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
    TranslateModule
  ],
  declarations: [
    StatusCardComponent,
    EchartsPieComponent,
    EchartsAreaStackComponent,
    SecurityCamerasComponent,
    DashboardComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    OrdersChartComponent,
    ProfitChartComponent,
    LegendChartComponent,
    EarningCardComponent,
    EarningCardFrontComponent,
    EarningCardBackComponent,
    EarningPieChartComponent,
    EarningLiveUpdateChartComponent,
    CalendarComponent,
    DayCellComponent,
    StatusCardFrontComponent,
    StatusCardBackComponent,
    TrafficComponent,
    TrafficChartComponent,
  ],
  providers: [],
})
export class DashboardModule {
}
