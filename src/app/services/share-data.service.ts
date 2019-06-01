import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShareDataService {

  private messageSource = new BehaviorSubject('');
  currentData = this.messageSource.asObservable();

  constructor() { }

  changeData(data: any) {
    this.messageSource.next(data);
  }

}