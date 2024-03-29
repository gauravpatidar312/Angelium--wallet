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
      title: 'XGAMES',
      source: '/assets/images/xgames.jpg',
    },
    {
      title: 'XWISH',
      source: '/assets/images/xwish.jpg',
    },
    {
      title: 'XCOMIC',
      source: '/assets/images/xcomic.jpg',
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
