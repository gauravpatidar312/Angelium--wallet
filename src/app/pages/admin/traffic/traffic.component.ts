import { Component, OnDestroy, Input } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { TrafficChartData } from '../../../@core/data/traffic-chart';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-traffic',
  styleUrls: ['./traffic.component.scss'],
  template: `
    <nb-card size="xsmall">
      <nb-card-header>
        <span>{{trafficHeading}}</span>
        <div class="dropdown ghost-dropdown" ngbDropdown>
          <button type="button" class="btn btn-sm btn-primary" ngbDropdownToggle>
            {{ type }}
          </button>
          <ul ngbDropdownMenu class="dropdown-menu">
            <li class="dropdown-item" *ngFor="let t of types" (click)="type = t">{{ t }}</li>
          </ul>
        </div>
      </nb-card-header>
      <nb-card-body class="p-0">
        <ngx-traffic-chart [trafficValue]="trafficValue"
          [points]="trafficChartPoints"></ngx-traffic-chart>
      </nb-card-body>
    </nb-card>
  `,
})
export class TrafficComponent implements OnDestroy {

  @Input() trafficHeading: string;
  @Input() trafficValue: number;

  private alive = true;
  trafficChartPoints: number[];
  type = this.translate.instant('common.month');
  types = [this.translate.instant('common.week'), this.translate.instant('common.month'), this.translate.instant('common.year')];

  constructor(private trafficChartService: TrafficChartData,
              private translate: TranslateService) {
    this.trafficChartService.getTrafficChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.trafficChartPoints = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
