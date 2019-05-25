import { Component, OnInit } from '@angular/core';
import { SmartTableData } from '../../@core/data/smart-table';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-angel',
  templateUrl: './angel.component.html',
  styleUrls: ['./angel.component.scss']
})
export class AngelComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  settings = {
    hideSubHeader: true,
    actions: false,
    pager : {
      display : false,
      },
    columns: {
      id: {
        title: 'Level',
        type: 'number',
        filter: false
      },
      firstName: {
        title: 'Your Reward',
        type: 'string',
        class: 'table-col',
        filter: false
      },
      lastName: {
        title: 'Reward Rate',
        type: 'string',
        filter: false
      },
      username: {
        title: 'Downline Rate',
        type: 'string',
        filter: false
      },
      email: {
        title: 'Heaven',
        type: 'string',
        filter: false
      },
      age: {
        title: 'Downline',
        type: 'number',
        filter: false
      },
    },
  };
  settingsnew = {
    hideSubHeader: true,
    actions: false,
    pager : {
      display : false,
      },
    columns: {
      id: {
        title: 'Level',
        type: 'number',
        filter: false
      },
      firstName: {
        title: 'Username',
        type: 'string',
        class: 'table-col',
        filter: false
      },
      lastName: {
        title: 'Rank',
        type: 'string',
        filter: false
      },
      username: {
        title: 'Heaven',
        type: 'string',
        filter: false
      },
      email: {
        title: 'Reward',
        type: 'string',
        filter: false
      },
      age: {
        title: 'Your Reward',
        type: 'number',
        filter: false
      },
    },
  };
  constructor(private service: SmartTableData) {
    const data = this.service.getData();
    const NewOBj= [];
    for (let x = 0; x < 10; x++) {
      NewOBj.push(data[x])
    }
    this.source.load(NewOBj);
  }

  ngOnInit() {
  }

}
