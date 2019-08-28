import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'ngx-status-card-front',
  styleUrls: ['./status-card-front.component.scss'],
  templateUrl: './status-card-front.component.html',
})
export class StatusCardFrontComponent implements OnDestroy, OnInit {
  private alive = true;
  @Input() statusCard: any;
  isProduction: any = environment.production;

  constructor() {
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.alive = false;
  }
}
