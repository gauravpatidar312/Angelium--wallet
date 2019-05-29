import {Component, OnInit} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {DialogNamePromptComponent} from './dialog-prompt/dialog-prompt.component';

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  name: string = 'Nick Jones';

  constructor(private dialogService: NbDialogService) {
  }

  ngOnInit() {
  }

  openDialog() {
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(name => {
      this.name = name;
    });
  }
}
