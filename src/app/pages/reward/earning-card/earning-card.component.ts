import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-earning-card',
  styleUrls: ['./earning-card.component.scss'],
  templateUrl: './earning-card.component.html',
})
export class EarningCardComponent {
  flipped = false;
  @Input() cardName: string = '';
  @Input() cardId: number = 0;
  @Input() selectedCurrency: string = 'BTC';
  @Input() amount: number = 0;
  @Input() quantity: number = 0;
  @Input() percentage: number = 0;
  @Input() infinity_name: string;

  toggleFlipView() {
    this.flipped = !this.flipped;
  }
}
