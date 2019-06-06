import {Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})

export class TermsConditionsComponent {

  constructor(protected ref: NbDialogRef<TermsConditionsComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
