import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'ngx-reward-status-card-front',
  styleUrls: ['./reward-status-card-front.component.scss'],
  templateUrl: './reward-status-card-front.component.html',
})
export class RewardStatusCardFrontComponent implements OnDestroy, OnInit {
  private alive = true;
  @Input() statusCard: any;
  @Input() fetchingRewardValue: boolean;

  isProduction: any = environment.production;

  constructor() {
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.alive = false;
  }
}
