import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { Camera, SecurityCamerasData } from '../data/security-cameras';

@Injectable()
export class SecurityCamerasService extends SecurityCamerasData {

  private cameras: Camera[] = [
    {
      title: 'XLOVE',
      source: 'assets/images/xlove.jpg',
      display: true,
    },
    {
      title: 'XCASINO',
      source: 'assets/images/xcasino.jpg',
      display: true,
    },
    {
      title: 'XWISH',
      source: 'assets/images/xwish.jpg',
      display: true,
    },
    {
      title: 'XTRAVEL',
      source: 'assets/images/xtravel.jpg',
      display: true,
    },
    {
      title: 'XMALL',
      source: 'assets/images/xmall.jpg',
      display: true,
    },
    {
      title: 'XSCHOOL',
      source: 'assets/images/xschool.jpg',
      display: true,
    },
  ];

  getCamerasData(): Observable<Camera[]> {
    return observableOf(this.cameras);
  }
}
