import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ToastrService} from './services/toastr.service';

import * as firebase from 'firebase';
import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  messaging: any;
  currentMessage: any = new BehaviorSubject(null);
  isGranted: boolean = false;
  isSupported: boolean = false;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private toastrService: ToastrService) {
    this.isSupported = firebase.messaging.isSupported();
    if (this.isSupported)
      this.messaging = firebase.messaging();
  }

  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;

      const data = {[user.uid]: token};
      this.db.object('fcmTokens/').update(data);
    });
  }

  getPermission() {
    if (!this.isSupported) return;
    this.messaging.requestPermission()
      .then(() => {
        this.isGranted = true;
        return this.messaging.getToken();
      })
      .then(token => {
        this.updateToken(token);
      })
      .catch((err) => {
        console.warn('Unable to get permission to notify.', err);
      });
  }

  async getToken() {
    try {
      if (this.isGranted && this.isSupported)
        return await this.messaging.getToken();
    } catch (ex) {
      console.warn('FCM token error: ', ex);
    }
    return '';
  }

  receiveMessage() {
    if (!(this.isGranted && this.isSupported)) return;
    this.messaging.onMessage((payload) => {
      this.toastrService.success(payload.notification.body, payload.notification.title);
      this.currentMessage.next(payload);
    });
  }
}
