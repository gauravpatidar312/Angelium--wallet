import {Component, OnInit, AfterViewInit} from '@angular/core';
import {NbMediaBreakpoint} from '@nebular/theme';

declare let jQuery: any;

@Component({
  selector: 'ngx-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss'],
})

export class PairComponent implements OnInit, AfterViewInit {
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  myWallets: any = [];

  constructor() {}

  users: { picture: string, name: string, title: string, message: string }[] = [
    { picture: 'CE', name: 'RYELU08233', title: 'silver angel 12', message: 'wish me luck!!' },
    { picture: 'BK', name: 'RYELU08233', title: 'silver angel 12', message: 'wish me luck!!'},
    { picture: 'J', name: 'Janitor', title: 'Janitor', message: '' },
    { picture: 'PC', name: 'Perry Cox', title: 'Doctor of Medicine', message: '' },
    { picture: 'BS', name: 'Ben Sullivan', title: 'Carpenter and photographer', message: '' },
    { picture: 'CE', name: 'Carla Espinosa', title: 'Nurse', message: '' },
    { picture: 'BK', name: 'Bob Kelso', title: 'Doctor of Medicine', message: '' },
    { picture: 'J', name: 'Janitor', title: 'Janitor', message: '' },
    { picture: 'PC', name: 'Perry Cox', title: 'Doctor of Medicine', message: '' },
    { picture: 'BS', name: 'Ben Sullivan', title: 'Carpenter and photographer', message: '' },
  ];

  winnerUsers: { id: number, prizeName: string, XPAmount: string, picture: string, name: string, title: string, message: string }[] = [
    { id: 1, prizeName: 'ST PRIZE', XPAmount: '122000 XP', picture: 'CE', name: 'RYELU08233', title: 'silver angel 12', message: 'wish me luck!!' },
    { id: 2, prizeName: 'ND PRIZE', XPAmount: '41240 XP', picture: 'BK', name: 'RYELU08233', title: 'silver angel 12', message: 'wish me luck!!' },
    { id: 3, prizeName: 'RD PRIZE', XPAmount: '12720 XP ', picture: 'J', name: 'RYELU08233', title: 'silver angel 12', message: 'wish me luck!!' },
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    jQuery('ul.downLine li a').click(function (e) {
      jQuery('ul.downLine li.active').removeClass('active');
      jQuery(this).parent('li').addClass('active');
    });

    const challengeDiv = jQuery('#betting-body').height() + jQuery('#betting-footer').height() + 70;
    jQuery('#challenges-body').css({ maxHeight: challengeDiv});
  }
}
