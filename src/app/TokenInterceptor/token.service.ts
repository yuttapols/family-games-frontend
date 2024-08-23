import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APP, CALL_SERVICE } from '../util/Constants';
import { SharingService } from '../SharingService';

const apiUrl = environment.apiUrl;
const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'accept': '*/*' }) };
const httpOptionsMultipart = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'accept': '*/*' }) };
const httpOptionsText = { headers: new HttpHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }) };

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  tokenData : any

constructor(private http: HttpClient,
  private sharing : SharingService,
) {
  this.sharing.tokenData.subscribe( value => {
    var userDataSession : any = sessionStorage.getItem("tokenData")
    this.tokenData = JSON.parse(userDataSession)
  });
}

  refreshToken(token : any): Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.AUTHENTICATION.REFRESH_TOKEN)).concat('?token=' + token);
    return this.http.get(url)
  }
}
