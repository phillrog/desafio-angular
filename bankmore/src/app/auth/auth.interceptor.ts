// src/app/auth/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // É crucial enviar o cookie de sessão
    const modifiedRequest = request.clone({
      withCredentials: true
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 401) {
          console.log('401 Unauthorized recebido. Redirecionando para o login do Identity Server.');
          
          this.authService.startLoginFlow();
          
          return new Observable<HttpEvent<any>>(); 
        }

        return throwError(() => error);
      })
    );
  }
}