import { Component, OnInit } from '@angular/core';
import { icons } from 'eva-icons';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from './dialog-prompt/dialog-prompt.component';
import { ToastrService } from "../../services/toastr.service";
import { HttpService } from "../../services/http.service";
import { ShareDataService } from "../../services/share-data.service";

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  userData: any = { 'username': '', 'link': '', 'user_id': '', 'country': '' };
  urls = ['username/', 'referral-link/', 'user_id/', 'country/'];

  constructor(
    private toastrService: ToastrService,
    private dialogService: NbDialogService,
    private httpService: HttpService,
    private shareDataService: ShareDataService) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
  }

  name: string = 'Nick Jones';

  ngOnInit() {
    this.toastrService.success('Welcome on setting', 'Settings');
    this.httpService.get('username/').subscribe(data=>{
      this.userData.username = data.username;
    });

    this.httpService.get('referral-link/').subscribe(data=>{
      this.userData.link = data.link;
    });

    this.httpService.get('user_id/').subscribe(data=>{
      this.userData.user_id = data.user_id;
    });

    this.httpService.get('country/').subscribe(data=>{
      this.userData.country = data.country;
    });
  }

  openDialog(val: any) {
    this.newData(val);
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(data => {
        if (val == 'password' && data!=undefined && data!='') {
          this.httpService.postWithToken({ 'password': data }, 'password/')
          .subscribe(data=>{
            this.toastrService.success('Update password successfully', 'Password');
          }, err=>{
            console.log(err);
          });
        }
    });
  }

  newData(name: any) {
    this.shareDataService.changeData(name)
  }
}
