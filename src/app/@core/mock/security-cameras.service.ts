import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { Camera, SecurityCamerasData } from '../data/security-cameras';

@Injectable()
export class SecurityCamerasService extends SecurityCamerasData {

  private cameras: Camera[] = [
    {
      title: 'XLOVE',
      source: '/assets/images/xlove.jpg',
    },
    {
      title: 'XCASINO',
      source: '/assets/images/xcasino.jpg',
    },
    {
      title: 'XWISH',
      source: '/assets/images/xwish.jpg',
    },
    {
      title: 'XTRAVEL',
      source: '/assets/images/xtravel.jpg',
    },
    {
      title: 'XMALL',
      source: '/assets/images/xmall.jpg',
    },
    {
      title: 'XSCHOOL',
      source: '/assets/images/xschool.jpg',
    },
  ];

  getCamerasData(): Observable<Camera[]> {
    return observableOf(this.cameras);
  }
}
