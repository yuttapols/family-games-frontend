import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, switchMap, take, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { SharingService } from '../SharingService';
import { TokenService } from './token.service';
import { filter } from 'lodash';
import { APP, CALL_SERVICE } from '../util/Constants';
import {jwtDecode } from 'jwt-decode';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private router: Router,private sharing : SharingService,
    private callService : TokenService,
  ) { }

  tokenData : any
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    var userDetailSession : any = sessionStorage.getItem("tokenData")
    this.tokenData = JSON.parse(userDetailSession)

    if (request.url.includes(APP.API_VERSION.concat(CALL_SERVICE.AUTHENTICATION.LOGIN))) {
      return next.handle(request).pipe(
        catchError((err) => {
            this.setConditionError(err);
            const error = err.error.message || err.statusText;
            return throwError(() => error);
          })
        );
    }
    if(null != this.tokenData){
      let accessToken  = this.tokenData.accessToken;
      if (request.url.includes(APP.API_VERSION.concat(CALL_SERVICE.AUTHENTICATION.REFRESH_TOKEN))) {
        return next.handle(
          request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + this.tokenData.token),
          })
        ).pipe(
          catchError((err) => {
              this.setConditionError(err);
              const error = err.error.message || err.statusText;
              return throwError(() => error);
            })
          );;
      }

      let decodeToken = jwtDecode(accessToken);
      const isExpired = decodeToken && decodeToken.exp? decodeToken.exp < Date.now() / 1000 : false;

      if(isExpired){
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);
          return this.callService.refreshToken(this.tokenData.token).pipe(
            switchMap((res) => {
              this.setDataRefreshToken(res)
              return this.retryFailedRequests(request, next);
            }),
            catchError((err) => {
              this.logout()
              this.isRefreshing = false;
              return throwError(err);
            })
          );
        } else {
          return this.callService.refreshToken(this.tokenData.token).pipe(
            switchMap((res) => {
              this.setDataRefreshToken(res)
              accessToken = res.accessToken
              return this.retryFailedRequests(request, next);
            }),
            catchError((err) => {
              this.logout()
              this.isRefreshing = false;
              return throwError(err);
            })
          );
        }
      }else{
        const reqClone = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + accessToken),
        });
        return next.handle(reqClone).pipe(
          catchError((err) => {
            this.setConditionError(err);
              const error = err.error.message || err.statusText;
              return throwError(() => error);
            })
          );
      }
    }
    return next.handle(request).pipe(
    catchError((err) => {
        this.setConditionError(err);
        const error = err.error.message || err.statusText;
        return throwError(() => error);
      })
    );
  }

  private retryFailedRequests(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      take(1),
      switchMap((token) => {
        const reqClone = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
        });

        return next.handle(reqClone).pipe(
          catchError((err) => {

              return throwError(() => 'refreshToken');
            })
          );
      })
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }

  setDataRefreshToken(res : any){
    sessionStorage.removeItem("tokenData")
    sessionStorage.setItem("tokenData", JSON.stringify(res))
    this.sharing.tokenData.next(true);
    this.isRefreshing = false;
    this.refreshTokenSubject.next(res.accessToken);
  }

  setConditionError(err : any){
    if ([401, 403].includes(err.status)) {
      this.errorSwal(err)
    }else if([500, 404,400,405].includes(err.status)){
      this.errorSwal(err)
    }else if([0].includes(err.status)){
      this.errorSwal(err)
    }
  }



  logout(){
    sessionStorage.removeItem("tokenData")
    this.sharing.tokenData.next(true);
    this.sharing.tokenExpire.next(true);
    this.router.navigate(['/auth/signin']);
  }

  errorSwal(err : any){
    let head = '';
    let detail = '';

    if(err.status == 500){
      if('401 UNAUTHORIZED' == err.error.message){
        head =  err.error.status + '=  Token Expire!: ' + err.error.error
        detail =  ' Detail : ' + 'Please Login again.'
      }else{
        head =  err.error.status + '=  Server Error : ' + err.error.error
        detail =  ' Detail : ' + err.error.message
      }

    }else if(err.status == 405){
      head =  err.error.status + '= METHOD_NOT_ALLOWED : ' + err.error.error
      detail =  ' Detail : ' + err.error.message
    }else if(err.status == 404){
      head =  err.error.status + '= NOT_FOUND Server : ' + err.error.error
      detail =  ' Detail : ' + err.error.message
    }else if(err.status == 400){
      head =  err.error.status + '= REQUEST_BAD Server : ' + err.error.error
      detail =  ' Detail : ' + err.error.message
    }else if([401, 403].includes(err.status)){
      head =  err.error.status + '= PERMISSION Server : ' + err.error.error
      detail =  ' Detail : ' + err.error.message
    }else if([0].includes(err.status)){
      head =    ' CONNECTION_REFUSED : '
      detail =  ' Detail : ' + 'Connect Server Fail !'
    }

    let textHtml = '<b>' + head + '</b>' + '<p>' + detail + '</p>'

    Swal.fire({
      title: "<strong>เกิดข้อผิดพลาด!</strong>",
      icon: "error",
      html: textHtml,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: true,
      allowOutsideClick: false,
      confirmButtonText: 'ตกลง',
      heightAuto: false,
    }).then(res=>{
      if(res.isConfirmed){
        sessionStorage.removeItem("tokenData")
        this.sharing.tokenData.next(true);
        this.router.navigate(['/auth/signin']);
      }
    });
  }
}
