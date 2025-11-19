import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
  constructor(
    private readonly injector: Injector,
    private readonly jwtHelperService: JwtHelperService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const authService = this.injector.get(AuthService);
        const user = authService.getStoredUsed();

        if (
          [401, 403].includes(err.status) &&
          user !== undefined &&
          this.jwtHelperService.isTokenExpired(user.authentication)
        ) {
          authService.logout();
        }

        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(() => error);
      })
    );
  }
}