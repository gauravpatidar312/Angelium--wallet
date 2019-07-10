import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'ngx-reward-status-card-back',
  styleUrls: ['./reward-status-card-back.component.scss'],
  templateUrl: './reward-status-card-back.component.html',
})
export class RewardStatusCardBackComponent implements OnDestroy {
  private alive = true;
  @Input() statusCard: any;
  @Input() fetchingRewardValue: boolean;

  constructor() {}

  ngOnDestroy() {
    this.alive = false;
  }
}
