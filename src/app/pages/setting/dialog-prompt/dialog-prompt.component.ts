import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ShareDataService } from "../../../services/share-data.service";

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-prompt.component.html',
  styleUrls: ['dialog-prompt.component.scss'],
})
export class DialogNamePromptComponent {
  inputValue:any;
  text:string;
  constructor(protected ref: NbDialogRef<DialogNamePromptComponent>,
   private shareDataService: ShareDataService) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  ngOnInit() {
    this.shareDataService.currentData.subscribe(data => {
      this.text = data.type;
      this.inputValue = data.value;
    });
  }

}