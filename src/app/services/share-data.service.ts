import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShareDataService {

  private messageSource = new BehaviorSubject<any>('');
  currentData = this.messageSource.asObservable();

  constructor() { }

  changeData(data: any) {
    this.messageSource.next(data);
  }

  static getErrorMessage(err: any) {
    let msg = 'Something went wrong. We request you to try after sometime.';
    if (err.error)
      msg = err.error[Object.keys(err.error)[0]][0];
    else if (err[Object.keys(err)[0]].length)
      msg = err[Object.keys(err)[0]][0];

    return msg;
  }
}
