import { Component, OnInit } from '@angular/core';
import { icons } from 'eva-icons';
import { ToastrService } from "../../services/toastr.service";

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  constructor(private toastrService: ToastrService) {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
   }

  ngOnInit() {
    this.toastrService.toastrSuccess('top-right', 'success', "Welcome on setting");
  }

}
