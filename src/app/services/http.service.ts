import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../@core/store/app.state';

@Injectable({
  providedIn: 'root',
})

export class HttpService {
  getState = null;
  private userInfo: any = null;
  constructor(public httpClient: HttpClient, private store: Store<AppState>) {
    this.getState = this.store.select(selectAuthState);
    this.getState.subscribe((state) => {
      this.userInfo = state.user;
    });
  }

  setHeaders() {
    let headers = new HttpHeaders();
    // const userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      headers = headers.append('Authorization', 'JWT ' + this.userInfo.token);
    }
    return headers;
  }

  get(endpoint) {
    return this.httpClient.get<any>(`${environment.apiUrl}/${endpoint}`, { headers: this.setHeaders() });
  }

  post(data, endpoint) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/${endpoint}`,
      data,
      {headers: this.setHeaders()},
    );
  }

  put(data, endpoint) {
    return this.httpClient.put<any>(
      `${environment.apiUrl}/${endpoint}`,
      data,
      {headers: this.setHeaders()},
    );
  }

  delete(id, endpoint) {
    return this.httpClient.delete(
      `${environment.apiUrl}/${endpoint}/${id}`,
      {headers: this.setHeaders()},
    );
  }

  uploadImage(data, endpoint) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/${endpoint}`,
      data,
      {headers: this.setHeaders()},
    );
  }
}
