import { Component, OnInit } from '@angular/core';
import { icons } from 'eva-icons';

@Component({
  selector: 'ngx-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  evaIcons = [];
  constructor() {
    this.evaIcons = Object.keys(icons).filter(icon => icon.indexOf('outline') === -1);
   }

  ngOnInit() {
  }

}
