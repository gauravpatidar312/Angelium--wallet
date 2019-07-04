import { Injectable } from "@angular/core";
import { NgxIndexedDB } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
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
        const objectStoreLang = evt.currentTarget.result.createObjectStore('languageInfo', { keyPath: 'uid' });
        const angeliumInfo = evt.currentTarget.result.createObjectStore('angeliumInfo', { keyPath: 'uid' });
        angeliumInfo.createIndex('invitationCode', 'invitationCode');
        angeliumInfo.createIndex('waitTime', 'waitTime');
        observer.complete();
      });
    });
  }

  saveToAngeliumSession(value) {
    this.dbAngelium.getByKey('angeliumInfo', 1).then((data) => {
      if (!data) {
        value.uid = 1;
        this.dbAngelium.add('angeliumInfo', value).then((dbData) => {
        },
          (err) => {
            console.error(err);
          });
      } else {
        value.uid = data.uid;
        this.dbAngelium.update('angeliumInfo', value).then(() => {
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
  getAngeliumStorage() {
    return new Promise((resolve, reject) => {
      this.dbAngelium.openDatabase(1).then(() => {
        this.dbAngelium.getByKey('angeliumInfo', 1).then((data) => {
          resolve(data);
        }, (error) => {
          console.warn(error);
          reject(false);
        });
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

  storeLangIndexDb(value){
    this.dbAngelium.getByKey('languageInfo', 2).then((data) => {
      if (!data) {
        value.uid = 2;
        this.dbAngelium.add('languageInfo', value).then((dbData) => {
        },
          (err) => {
            console.error(err);
          });
      } else {
        value.uid = data.uid;
        this.dbAngelium.update('languageInfo', value).then(() => {
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

  getLangFormIndexDb(): Observable<any>{
    return Observable.create((observer: any) => {
      this.dbAngelium.openDatabase(1).then(() => {
        this.dbAngelium.getByKey('languageInfo', 2).then((data) => {
          observer.next(data);
          observer.complete();
        }, (error) => {
          console.warn(error);
          return 'false';
        });
      });
    });
  }

  async getSessionStorage() {
    return new Promise((resolve, reject) => {
      this.dbAngelium.openDatabase(1).then(() => {
        this.dbAngelium.getByKey('userInfo', 1).then((data) => {
          resolve(data);
        }, (error) => {
          console.warn(error);
          reject(false);
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
          console.warn(error);
        });
    });
  }

  deleteDatabase() {
    this.dbAngelium.deleteDatabase();
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
