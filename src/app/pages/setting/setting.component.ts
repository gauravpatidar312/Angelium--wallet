import { Component, OnInit } from '@angular/core';
import { icons } from 'eva-icons';
import { ToastrService } from "../../services/toastr.service";
import {NbDialogService} from '@nebular/theme';
import {DialogNamePromptComponent} from './dialog-prompt/dialog-prompt.component';


@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  constructor(private toastrService: ToastrService, private dialogService: NbDialogService) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
   }

  name: string = 'Nick Jones';

  ngOnInit() {
    this.toastrService.toastrSuccess('top-right', 'success', "Welcome on setting");
  }

  openDialog() {
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(name => {
      this.name = name;
    });
  }
}
