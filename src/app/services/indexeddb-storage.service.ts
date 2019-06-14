import { Injectable } from "@angular/core";
import { NgxIndexedDB } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class IndexedDBStorageService {

  key = null;
  dbAngelium = new NgxIndexedDB('angelium', 1);
  constructor() {
    this.createStore().toPromise();
  }

  createStore() {
    return Observable.create((observer: any) => {
      this.dbAngelium.openDatabase(1, evt => {
        const objectStore = evt.currentTarget.result.createObjectStore('userInfo', { keyPath: 'uid' });
        objectStore.createIndex('avatar', 'avatar');
        objectStore.createIndex('country', 'country');
        objectStore.createIndex('email', 'email');
        objectStore.createIndex('first_name', 'first_name');
        objectStore.createIndex('fullname', 'fullname');
        objectStore.createIndex('id', 'id');
        objectStore.createIndex('is_admin', 'is_admin');
        objectStore.createIndex('last_name', 'last_name');
        objectStore.createIndex('phone', 'phone');
        objectStore.createIndex('r18mode', 'r18mode');
        objectStore.createIndex('referral_link', 'referral_link');
        objectStore.createIndex('token', 'token');
        objectStore.createIndex('user_type', 'user_type');
        objectStore.createIndex('username', 'username');
        observer.complete();
      });
    });
  }

  saveToSession(value) {
    this.dbAngelium.getByKey('userInfo', 1).then((data) => {
      if (!data) {
        value.uid = 1;
        this.dbAngelium.add('userInfo', value).then((dbData) => {
        },
          (err) => {
            console.error(err);
          });
      } else {
        value.uid = data.uid;
        this.dbAngelium.update('userInfo', value).then(() => {
        },
          (error) => {
            console.error(error);
            return 'false';
          });
      }
    }, (error) => {
      console.error(error);
    });
  }

  getSessionStorage(): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbAngelium.openDatabase(1).then(() => {
        this.dbAngelium.getByKey('userInfo', 1).then((data) => {
          observer.next(data);
          observer.complete();
        }, (error) => {
          console.error(error);
          return 'false';
        });
      });
    });
  }

  resetStorage() {
    this.dbAngelium.openDatabase(1).then(() => {
      this.dbAngelium.clear('userInfo').then(
        () => {
          this.createStore().toPromise();
        }, error => {
          console.log(error);
        });
    });
  }

  updateSessionData = function (value) {
    this.dbAngelium.getByKey('userInfo', 1).then((data) => {
      if (data) {
        value.uid = data.uid;
        this.dbAngelium.update('userInfo', value).then(() => {
        },
          (error) => {
            console.error(error);
            return 'false';
          });
      }
    }, (error) => {
      console.error(error);
      return 'false';
    });
  };
}
