import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { SessionStorageService } from "../services/session-storage.service";
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../@core/store/app.state';

@Injectable({
  providedIn: "root"
})
export class HttpService {
  getState = null;
  private userInfo: any = {};
  constructor(public httpClient: HttpClient, private store: Store<AppState>,) {
    this.getState = this.store.select(selectAuthState);
    this.getState.subscribe((state) => {
      this.userInfo = state.user;
    });
  }

  globle_header_token() {
    // let userInfo = sessionStorage.getItem("userInfo");
    var _headers = new HttpHeaders().set('Content-Type', 'application/json');
    var headers = _headers.append('Authorization', 'JWT ' + this.userInfo.token);
    return headers;
  }

  headerToken() {
    // let userInfo = sessionStorage.getItem("userInfo");
    var _headers = new HttpHeaders().set('Authorization', 'JWT ' + this.userInfo.token);
    return _headers;
  }

  post(data, endpoint) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/${endpoint}`,
      data
    );
  }
  
  put(id, data, endpoint) {
    return this.httpClient.put(
      `${environment.apiUrl}/${endpoint}/${id}`,
      data
    );
  }

  get(endpoint) {
    return this.httpClient.get<any>(`${environment.apiUrl}/${endpoint}`, {
      headers: this.globle_header_token()
    });
  }
 
  delete(id, data, endpoint) {
    return this.httpClient.delete(
      `${environment.apiUrl}/${endpoint}/${id}`,
      data
    );
  }

  postWithToken(data, endpoint) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/${endpoint}`,
      data, { headers: this.globle_header_token() }
    );
  }

  putWithToken(data, endpoint) {
    return this.httpClient.put<any>(
      `${environment.apiUrl}/${endpoint}`,
      data, { headers: this.globle_header_token() }
    );
  }

  uploadImage(data, endpoint) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/${endpoint}`,
      data, { headers: this.headerToken() }
    );
  }
}
