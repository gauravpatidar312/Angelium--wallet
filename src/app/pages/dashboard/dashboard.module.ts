import {NgModule} from '@angular/core';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TranslateModule} from '@ngx-translate/core';

import {ThemeModule} from '../../@theme/theme.module';
import {DashboardComponent} from './dashboard.component';
import {ProfitCardComponent} from './profit-card/profit-card.component';
import {ECommerceChartsPanelComponent} from './charts-panel/charts-panel.component';
import {OrdersChartComponent} from './charts-panel/charts/orders-chart.component';
import {ProfitChartComponent} from './charts-panel/charts/profit-chart.component';
import {ChartPanelHeaderComponent} from './charts-panel/chart-panel-header/chart-panel-header.component';
import {ChartPanelSummaryComponent} from './charts-panel/chart-panel-summary/chart-panel-summary.component';
import {ChartModule} from 'angular2-chartjs';
import {StatsCardBackComponent} from './profit-card/back-side/stats-card-back.component';
import {StatsAreaChartComponent} from './profit-card/back-side/stats-area-chart.component';
import {StatsBarAnimationChartComponent} from './profit-card/front-side/stats-bar-animation-chart.component';
import {StatsCardFrontComponent} from './profit-card/front-side/stats-card-front.component';
import {TrafficRevealCardComponent} from './traffic-reveal-card/traffic-reveal-card.component';
import {TrafficBarComponent} from './traffic-reveal-card/front-side/traffic-bar/traffic-bar.component';
import {TrafficFrontCardComponent} from './traffic-reveal-card/front-side/traffic-front-card.component';
import {TrafficCardsHeaderComponent} from './traffic-reveal-card/traffic-cards-header/traffic-cards-header.component';
import {TrafficBackCardComponent} from './traffic-reveal-card/back-side/traffic-back-card.component';
import {TrafficBarChartComponent} from './traffic-reveal-card/back-side/traffic-bar-chart.component';
import {SecurityCamerasComponent} from './security-cameras/security-cameras.component';
import {
  VisitorsAnalyticsComponent,
} from './visitors-analytics/visitors-analytics.component';
import {
  VisitorsAnalyticsChartComponent,
} from './visitors-analytics/visitors-analytics-chart/visitors-analytics-chart.component';
import {
  VisitorsStatisticsComponent,
} from './visitors-analytics/visitors-statistics/visitors-statistics.component';
import {LegendChartComponent} from './legend-chart/legend-chart.component';
import {UserActivityComponent} from './user-activity/user-activity.component';
import {ProgressSectionComponent} from './progress-section/progress-section.component';
import {SlideOutComponent} from './slide-out/slide-out.component';

import {CountryOrdersComponent} from './country-orders/country-orders.component';
import {CountryOrdersMapComponent} from './country-orders/map/country-orders-map.component';
import {CountryOrdersMapService} from './country-orders/map/country-orders-map.service';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {CountryOrdersChartComponent} from './country-orders/chart/country-orders-chart.component';
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
    StatsCardFrontComponent,
    StatsAreaChartComponent,
    StatsBarAnimationChartComponent,
    ProfitCardComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    OrdersChartComponent,
    ProfitChartComponent,
    StatsCardBackComponent,
    TrafficRevealCardComponent,
    TrafficBarChartComponent,
    TrafficFrontCardComponent,
    TrafficBackCardComponent,
    TrafficBarComponent,
    TrafficCardsHeaderComponent,
    CountryOrdersComponent,
    CountryOrdersMapComponent,
    CountryOrdersChartComponent,
    VisitorsAnalyticsComponent,
    VisitorsAnalyticsChartComponent,
    VisitorsStatisticsComponent,
    LegendChartComponent,
    UserActivityComponent,
    ProgressSectionComponent,
    SlideOutComponent,
    EarningCardComponent,
    EarningCardFrontComponent,
    EarningCardBackComponent,
    EarningPieChartComponent,
    EarningLiveUpdateChartComponent,
    CalendarComponent,
    DayCellComponent,
    StatusCardFrontComponent,
    StatusCardBackComponent
  ],
  providers: [
    CountryOrdersMapService,
  ],
})
export class DashboardModule {
}
