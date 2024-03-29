import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ShareDataService} from '../../services/share-data.service';
import {NbMediaBreakpoint} from '@nebular/theme';
import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
declare let jQuery: any;

@Component({
  selector: 'ngx-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss'],
})

export class PairComponent implements OnInit, AfterViewInit, OnDestroy  {
  @Output() messageEvent = new EventEmitter<any>();
  fetchPairSpinner: boolean = false;
  fetchPairData: boolean = false;
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  myWallets: any = [];
  pairs = [];
  currentPairData: any;
  private onDestroyObservable = new Subject<any>();

  constructor(private httpService: HttpService,
              private shareDataService: ShareDataService) {
    this.getPairData();
  }

  ngOnInit() {
    Observable.interval(environment.exchangeInterval).takeUntil((this.onDestroyObservable)).subscribe(() => {
      this.getPairData();
    });
  }

  ngAfterViewInit() {
    jQuery('ul.downLine li a').click(function (e) {
      jQuery('ul.downLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });

    const challengeDiv = jQuery('#betting-body').height() + jQuery('#betting-footer').height() + 70;
    jQuery('#challenges-body').css({maxHeight: challengeDiv});
  }

  clickPair(data) {
    this.shareDataService.lastFetchDateTime = moment().subtract('days', 7).valueOf();
    this.shareDataService.currentPair = data;
    this.currentPairData = data;
    this.messageEvent.emit(data);
  }

  getPairData() {
      // this.fetchPairSpinner = !this.shareDataService.showSpinnerForExchange;
      this.httpService.get('exchange/traded_pairs/').subscribe((res?: any) => {
      if (res.status) {
        this.fetchPairSpinner = false;
        this.fetchPairData = true;
        if (!this.pairs.length) {
          res.data.traded_pairs.map(val => {
            this.pairs.push({
              'width': 355,
              'height': 355,
              'symbol': val.name.replace('/', '').toUpperCase(),
              'interval': 'D',
              'timezone': 'Etc/UTC',
              'theme': 'Dark',
              'style': '1',
              'locale': 'en',
              'toolbar_bg': '#f1f3f6',
              'enable_publishing': false,
              'withdateranges': true,
              'range': '5d',
              'allow_symbol_change': true,
              'container_id': 'tradingview_58f3c',
              'price': val.price,
              'change': val.change,
              'pair': val.name,
              'from': val.name.split('/')[0],
              'to': val.name.split('/')[1]
            });
          });
        }
        this.clickPair(!this.currentPairData ? this.pairs[0] : this.currentPairData);
      }
    });
  }

  ngOnDestroy() {
    this.onDestroyObservable.next();
  }
}
