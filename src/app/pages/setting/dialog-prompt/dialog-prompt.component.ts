import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-prompt.component.html',
  styleUrls: ['dialog-prompt.component.scss'],
})
export class DialogNamePromptComponent {

  constructor(protected ref: NbDialogRef<DialogNamePromptComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
