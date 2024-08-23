import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP, CALL_SERVICE } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';


const apiUrl = environment.apiUrl;
const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'accept': '*/*' }) };
const httpOptionsMultipart = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'accept': '*/*' }) };
const httpOptionsText = { headers: new HttpHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }) };


@Injectable({
  providedIn: 'root'
})
export class AuthenService {

constructor(private http: HttpClient,) { }

  login(userName:any, password:any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.AUTHENTICATION.LOGIN)).concat('?userName=' + userName + '&password='+ password);
    return this.http.get(url)
  }

  checkUsreName(userName : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.CHECK_USERNAME)).concat('?userName=' + userName);
    return this.http.get(url)
  }

  saveCustomer(data : any) : Observable<any> {
    const body = JSON.stringify(data);
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.SAVE_CUSTOMER));
    return this.http.put<any>(url, body, httpOptions)
  }

}
