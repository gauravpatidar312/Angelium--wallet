import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IndexedDBStorageService} from './indexeddb-storage.service';
import {Store} from '@ngrx/store';
import {AppState} from '../@core/store/app.state';
import {ResetState} from '../@core/store/actions/user.action';

import * as _ from 'lodash';

@Injectable()
export class ShareDataService {

  private messageSource = new BehaviorSubject<any>('');
  currentData = this.messageSource.asObservable();

  showNotification = false;
  transferTab: string;
  transferTitle: string;
  constructor(private storageService: IndexedDBStorageService,
              private store: Store<AppState>) {}

  changeData(data: any) {
    this.messageSource.next(data);
  }

  static toFixedDown(number: number, digits: number = 0) {
    const re = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)'), m = number.toString().match(re);
    return m ? parseFloat(m[1]) : number.valueOf();
  }

  getErrorMessage(err: any) {
    let msg = 'Something went wrong. We request you to try after sometime.';

    if (err.status === 401) {
      console.warn('DB cleared after 401 error');

      this.changeData('');
      this.storageService.resetStorage();
      this.store.dispatch(new ResetState({}));

      msg = 'Session expired. Please log in again.';
      return msg;
    }

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

    if (msg === 'true' || typeof msg !== 'string')
      msg = 'Something went wrong. We request you to try after sometime.';

    return msg;
  }
}
