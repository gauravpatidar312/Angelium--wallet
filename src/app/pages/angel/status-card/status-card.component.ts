import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  templateUrl: './status-card.component.html',
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: any;
  @Input() value: string;
  @Input() on = true;
  selectedType = '1';
}
