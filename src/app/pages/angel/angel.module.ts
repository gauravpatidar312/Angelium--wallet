import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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


@NgModule({
  declarations: [AngelComponent,
    EarningCardComponent,
    EarningCardBackComponent,
    EarningCardFrontComponent,
    EarningPieChartComponent,
    EarningLiveUpdateChartComponent,
    EchartsPieComponent,
    EchartsAreaStackComponent,
    BubbleMapComponent
    ],
  imports: [
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
