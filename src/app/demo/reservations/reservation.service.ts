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
export class ReservationService {

constructor(private http: HttpClient,) { }

  getAllRevStatusWaiting() : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GETALL_BYSTATUS_WAITING));
    return this.http.get(url)
  }

  getSeatTypeAll() : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GET_SEATTYPEALL));
    return this.http.get(url)
  }

  saveRev(data : any) : Observable<any> {
    const body = JSON.stringify(data);
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.SAVE_REV));
    return this.http.post<any>(url, body, httpOptions)
  }

  getRevByUserIdStatusWaiting(userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GET_BYUSERID_WAITING)).concat("?userId=" + userId);
    return this.http.get(url)
  }

  getReasonCancelAll() : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GETALL_REASON_CANCEL));
    return this.http.get(url)
  }

  updateRev(data : any, revId : any) : Observable<any> {
    const body = JSON.stringify(data);
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.UPDATE_REV)).concat("/" + revId);
    return this.http.put<any>(url, body, httpOptions)
  }

  checkMaximumCancelRev(userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.CHECK_MAXIMUM_CANCELREV)).concat("?userId=" + userId);
    return this.http.get(url)
  }

  getAllRevByUserId(userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GETALL_REV_BYUSERID)).concat("?userId=" + userId);
    return this.http.get(url)
  }

  getRevAll() : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GETALL_REV));
    return this.http.get(url)
  }
}
