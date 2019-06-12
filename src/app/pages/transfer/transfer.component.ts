import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';
import {ShareDataService} from '../../services/share-data.service';

declare const jQuery: any;
@Component({
  selector: 'ngx-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  public barcode = require("assets/images/barcode.png");
  private alive = true;
  @Output() periodChange = new EventEmitter<string>();
  @Input() sendType: string = 'BTC';
  @Input() receiveType: string = 'BTC';
  @Input() fromType: string = 'ANX';
  @Input() toType: string = 'BTC';
  sendTypes: string[] = ['BTC', 'ETH', 'USDT'];
  receiveTypes: string[] = ['BTC', 'ETH', 'USDT'];
  fromTypes: string[] = ['ANX'];
  toTypes: string[] = ['BTC', 'ETH', 'USDT'];
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  currentTheme: string;
  setReceiveTab: boolean;
  setOTCTab: boolean;
  toggle: boolean;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private shareDataService: ShareDataService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  changePeriod(period: string, typeValue): void {
    if (typeValue === 'send')
      this.sendType = period;
    else if (typeValue === 'receive')
      this.receiveType = period;
    else if (typeValue === 'from')
      this.fromType = period;
    else if (typeValue === 'to')
      this.toType = period;
    this.periodChange.emit(period);
  }

  ngOnInit() {
    this.toggle = null;
    this.setReceiveTab = false;
    this.setOTCTab = false;
    if (this.shareDataService.transferTab === 'RECEIVE') {
      this.setReceiveTab = true;
      this.shareDataService.transferTab = null;
    }
    else if (this.shareDataService.transferTab === 'OTC') {
      this.setOTCTab = true;
      this.shareDataService.transferTab = null;
    }
  }

}
