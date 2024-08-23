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
export class ProfileService {

constructor(private http: HttpClient,) { }

  updateImageProfile(formData: FormData, userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.UPDATE_IMAGES_PROFILE)).concat("/"+ userId);
    return this.http.post<any>(url , formData);
  }

  getImageByteProfile(userDetailId: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.GET_IMAGES)).concat('?userDetailId='+userDetailId);
    // let url = API_ENDPOINT.concat(AppConstants.PROJECT_VERSION.concat(Modules.USER.getImageByte)).concat('?userDetailId='+userDetailId);
    return this.http.get<Blob>(url , {headers: headers, responseType: 'blob' as 'json' });
  }

  getUserDetailByUserId(userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.GET_BYID)).concat('?userId=' + userId);
    return this.http.get(url)
  }

  updateProfile(data : any, userId : any) : Observable<any> {
    const body = JSON.stringify(data);
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.UPDATE_PROFILE)).concat("/" + userId);
    return this.http.put<any>(url, body, httpOptions)
  }

  getUserByUserId(userId : any) : Observable<any> {
    let url = apiUrl.concat(APP.API_VERSION.concat(CALL_SERVICE.USER.GET_USER_BYUSERID)).concat('?userId=' + userId);
    return this.http.get(url)
  }
}
