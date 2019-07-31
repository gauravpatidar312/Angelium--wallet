import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, empty, from, of, throwError, pipe } from 'rxjs';
import { mergeMap, catchError, map, switchMap, concat, defaultIfEmpty } from 'rxjs/operators';
import { FirebaseOptions, FirebaseAppConfig, runOutsideAngular } from '@angular/fire';
import {ToastrService} from './services/toastr.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
  currentMessage: any = new BehaviorSubject(null);

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth,
    private toastrService: ToastrService) {}

  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;

      const data = { [user.uid]: token };
      this.db.object('fcmTokens/').update(data);
    });
  }

  getPermission() {
    if (!this.messaging) return;
    this.messaging.requestPermission()
      .then(() => {
        return this.messaging.getToken();
      })
      .then(token => {
        console.log(token);
        this.updateToken(token);
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  async getToken(){
    var tokan:any = '';
    if (!this.messaging) return;
    await this.messaging.getToken().then(val=>{
      tokan = val;
    }).catch((err=>{
      tokan = '';
    }));
    return tokan;
  }

  receiveMessage() {
    if (!this.messaging) return;
    this.messaging.onMessage((payload) => {
      console.log(payload);
      this.toastrService.success(payload.notification.body, payload.notification.title);
      this.currentMessage.next(payload);
    });
  }

}