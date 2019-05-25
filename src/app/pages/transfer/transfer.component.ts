import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  constructor() { }
 toggle: boolean;
  ngOnInit() {

this.toggle = null;  }
  trasfertoggle(val){
    if(val === 'send'){
      document.getElementById('fromid').style.display='block';
      document.getElementById('fromaccount').style.display='block';
      document.getElementById('toid').style.display='none';
      document.getElementById('toaccount').style.display='none';
      this.toggle= true;
    }else if(val === 'recieve'){
      document.getElementById('fromid').style.display='none';
      document.getElementById('fromaccount').style.display='none';
      document.getElementById('toid').style.display='block';
      document.getElementById('toaccount').style.display='block';
this.toggle= false;
    }else if(val === 'otc'){
      document.getElementById('fromid').style.display='block';
      document.getElementById('fromaccount').style.display='block';
      document.getElementById('toid').style.display='block';
      document.getElementById('toaccount').style.display='block';
this.toggle = null      
    }
  }
}
