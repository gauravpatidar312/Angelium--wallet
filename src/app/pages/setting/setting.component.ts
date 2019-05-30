import { Component, OnInit } from '@angular/core';
import { icons } from 'eva-icons';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from './dialog-prompt/dialog-prompt.component';
import { ToastrService } from "../../services/toastr.service";
import { HttpService } from "../../services/http.service";


@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  user: any;
  constructor(
    private toastrService: ToastrService, 
    private dialogService: NbDialogService,
    private httpService: HttpService) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
  }

  name: string = 'Nick Jones';

  ngOnInit() {
    this.toastrService.toastrSuccess('top-right', 'success', 'Welcome on setting');
    this.httpService.get('referral-link/').subscribe(data=>{
      this.user = data;
    });
  }

  openDialog() {
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(name => {
    });
  }
}
