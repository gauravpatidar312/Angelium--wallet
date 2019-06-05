import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  public barcode = require("assets/images/barcode.png");
  constructor() { }
  toggle: boolean;
  ngOnInit() {

    this.toggle = null;
  }

}
