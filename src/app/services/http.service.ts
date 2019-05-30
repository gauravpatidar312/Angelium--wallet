import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { SessionStorageService } from "../services/session-storage.service";

function globle_header_token() {
  let userInfo = sessionStorage.getItem("userInfo");
  var _headers = new HttpHeaders().set('Content-Type', 'application/json');
  var headers = _headers.append('Authorization', 'JWT '+JSON.parse(userInfo).token);
  return headers;
}

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(public httpClient: HttpClient) {

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
    return this.httpClient.get(`${environment.apiUrl}/${endpoint}/`, {
      headers: globle_header_token()
    });
  }
 
  delete(id, data, endpoint) {
    return this.httpClient.delete(
      `${environment.apiUrl}/${endpoint}/${id}`,
      data
    );
  }
}
