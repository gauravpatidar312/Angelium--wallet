import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-earning-card',
  styleUrls: ['./earning-card.component.scss'],
  templateUrl: './earning-card.component.html',
})
export class EarningCardComponent {
  flipped = false;

  @Input() selectedCurrency: string = 'BTC';
  @Input() currency: any;

  toggleFlipView() {
    this.flipped = !this.flipped;
  }
}
