import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { finalize, Observable } from 'rxjs';
import { APP, CALL_SERVICE } from 'src/app/util/Constants';

@Injectable({
  providedIn: 'root'
})
export class SpinnerInterceptorService implements HttpInterceptor{

  constructor(private spinnerService: SpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(APP.API_VERSION.concat(CALL_SERVICE.RESERVATION.GETALL_BYSTATUS_WAITING))) {
      this.spinnerService.show();
    }
    
    return next.handle(req).pipe(
      finalize(() => this.spinnerService.hide())
    );
  }

}
