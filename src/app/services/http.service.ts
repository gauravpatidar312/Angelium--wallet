import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

function setHeaders() {
  let headers = new HttpHeaders();
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo && JSON.parse(userInfo)) {
    headers = headers.append('Authorization', 'JWT ' + JSON.parse(userInfo).token);
  }
  return headers;
}

@Injectable({
  providedIn: 'root',
})

export class HttpService {
  constructor(public httpClient: HttpClient) {
  }

  get(endpoint) {
    return this.httpClient.get<any>(`${environment.apiUrl}/${endpoint}`, { headers: setHeaders() });
  }

  getLanguage(endpoint) {
    return this.httpClient.get<any>(`${environment.testUrl}/${endpoint}`);
  }

  post(data, endpoint) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/${endpoint}`,
      data,
      {headers: setHeaders()},
    );
  }

  put(data, endpoint) {
    return this.httpClient.put<any>(
      `${environment.apiUrl}/${endpoint}`,
      data,
      {headers: setHeaders()},
    );
  }

  delete(id, endpoint) {
    return this.httpClient.delete(
      `${environment.apiUrl}/${endpoint}/${id}`,
      {headers: setHeaders()},
    );
  }
}
