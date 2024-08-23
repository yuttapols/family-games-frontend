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
export class ManageCustomerService {

  constructor(private http: HttpClient,) { }

  getAllCustomers() : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.GET_CUSTOMERALL));
    return this.http.get(url)
  }

  deleteCustomer(userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.DELETE)).concat("?userId="+ userId);;
    return this.http.delete(url)
  }
}