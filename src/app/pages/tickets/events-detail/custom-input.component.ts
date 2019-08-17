import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    <div>
      <input class="form-control min-width" [(ngModel)]="rowData.newName" (blur)="nameChange()"
             [disabled]="isDisabled" placeholder="Enter Name" type="text">
    </div>`,
})
export class CustomInputComponent implements ViewCell, OnInit {
  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object
  @Output() onInputChange: EventEmitter<any> = new EventEmitter();
  isDisabled: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.isDisabled = !!this.rowData.name;
    if (!this.rowData.newName)
      this.rowData.newName = this.rowData.name;
  }

  nameChange() {
    this.onInputChange.emit(this.rowData);
  }
}
