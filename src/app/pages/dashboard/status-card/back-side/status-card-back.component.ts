import { Component, Input, OnDestroy } from '@angular/core';
import { PieChart, EarningData } from '../../../../@core/data/earning';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-status-card-back',
  styleUrls: ['./status-card-back.component.scss'],
  templateUrl: './status-card-back.component.html',
})
export class StatusCardBackComponent implements OnDestroy {
  private alive = true;
  @Input() title: string;
  @Input() type: string;
  @Input() value: string;
  @Input() on = true;
  @Input() id: number;
  @Input() fetchingAssetValue: boolean;

  constructor() {}

  ngOnDestroy() {
    this.alive = false;
  }
}
