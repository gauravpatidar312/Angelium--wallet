import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { LiveUpdateChart, EarningData } from '../../../../@core/data/earning';
import {Router} from '@angular/router';
import {ShareDataService} from '../../../../services/share-data.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'ngx-status-card-front',
  styleUrls: ['./status-card-front.component.scss'],
  templateUrl: './status-card-front.component.html',
})
export class StatusCardFrontComponent implements OnDestroy, OnInit {
  private alive = true;
  @Input() title: string;
  @Input() type: string;
  @Input() value: string;
  @Input() valueANX: number;
  @Input() on = true;
  @Input() id: number;
  @Input() fetchingAssetValue: boolean;

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
