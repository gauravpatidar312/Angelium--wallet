import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

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
 
  delete(id, data, endpoint) {
    return this.httpClient.delete(
      `${environment.apiUrl}/${endpoint}/${id}`,
      data
    );
  }
}
