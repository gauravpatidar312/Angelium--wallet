import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-earning-card',
  styleUrls: ['./earning-card.component.scss'],
  templateUrl: './earning-card.component.html',
})
export class EarningCardComponent {
  flipped = false;
  @Input() cardName: string = '';
  @Input() selectedCurrency: string = 'BTC';
  @Input() amount: number = 0;
  @Input() quantity: number = 0;
  @Input() percentage: number = 0;

  toggleFlipView() {
    this.flipped = !this.flipped;
  }
}
