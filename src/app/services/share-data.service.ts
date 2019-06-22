import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class ShareDataService {

  private messageSource = new BehaviorSubject<any>('');
  currentData = this.messageSource.asObservable();

  showNotification = false;
  transferTab: string;
  transferTitle: string;
  constructor() { }

  changeData(data: any) {
    this.messageSource.next(data);
  }

  static getErrorMessage(err: any) {
    let msg = 'Something went wrong. We request you to try after sometime.';
    if (err.status === 500)
      return msg;

    if (err.error) {
      delete err.error.status;
      if (err.error.message)
        msg = err.error.message;
      else if (_.isArray(err.error[Object.keys(err.error)[0]]))
        msg = err.error[Object.keys(err.error)[0]][0];
      else
        msg = err.error[Object.keys(err.error)[0]];
    } else if (_.isArray(err[Object.keys(err)[0]]))
      msg = err[Object.keys(err)[0]][0];
    else if (err[Object.keys(err)[0]])
      msg = err[Object.keys(err)[0]];

    if (msg === 'true' || Object.keys(msg).length)
      msg = 'Something went wrong. We request you to try after sometime.';

    return msg;
  }
}
