import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
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
  currentTheme: string;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.alive = false;
  }
}
