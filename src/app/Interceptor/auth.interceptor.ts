// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthApiService } from '../Service/AuthApi.service';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isDialogOpen = false;

  constructor(private authService: AuthApiService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const authReq = authToken ? req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.isLoggedIn() && this.authService.clearSession();
          this.router.navigate(['/auth']);
        } else if (error.status === 0 && !this.isDialogOpen) {
          this.isDialogOpen = true;
          Swal.fire({
            title: 'Server Unreachable',
            text: 'Unable to connect to the server. Please check your network connection or try again later.',
            icon: 'error',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.isDialogOpen = false; 
            if (result.value) {
              this.router.navigate(['/auth']);
            }
          });
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })
    );
  }
}
