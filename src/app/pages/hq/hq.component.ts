import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { SmartTableData } from '../../@core/data/smart-table';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'ngx-hq',
  templateUrl: './hq.component.html',
  styleUrls: ['./hq.component.scss']
})
export class HQComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number'
      },
      firstName: {
        title: this.translate.instant('pages.register.firstName'),
        type: 'string',
      },
      lastName: {
        title: this.translate.instant('pages.register.lastName'),
        type: 'string',
      },
      username: {
        title: this.translate.instant('common.username'),
        type: 'string',
      },
      email: {
        title: this.translate.instant('pages.setting.eMail'),
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };
  constructor(private service: SmartTableData,
    public translate: TranslateService) {
    const data = this.service.getData();
    this.source.load(data);
  }
  ngOnInit() {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
