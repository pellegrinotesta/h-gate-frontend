import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { SNACKBAR } from '../enums/snackbar-class.enum';
import { errorMessage } from '../utils/error-message';

/** Chiamate in background: un errore non deve disturbare l'utente con una snackbar. */
const SENZA_SNACKBAR = ['/notifiche'];

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
  constructor(
    private readonly injector: Injector,
    private readonly jwtHelperService: JwtHelperService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const authService = this.injector.get(AuthService);
        const user = authService.getStoredUsed();

        // Il backend risponde 401 se il token manca, non è valido o è scaduto
        const sessioneScaduta = err.status === 401 && user !== undefined &&
          (this.isExpired(user.authentication) || !request.url.endsWith('/authentication'));

        // Messaggio del server ({ ok: false, message }) o, in mancanza, lo statusText
        const error = (err && err.error && err.error.message) || err.statusText;

        if (sessioneScaduta) {
          authService.logout();
          this.snack('Sessione scaduta: effettua di nuovo l\'accesso.');
        } else if (!SENZA_SNACKBAR.some(u => request.url.includes(u))) {
          // Messaggio di riserva: se il componente mostra un suo messaggio, questo viene sostituito
          this.snack(errorMessage(error, 'Operazione non riuscita.'));
        }

        return throwError(() => error);
      })
    );
  }

  private isExpired(token: string): boolean {
    try {
      return this.jwtHelperService.isTokenExpired(token);
    } catch {
      return true;
    }
  }

  private snack(message: string): void {
    this.injector.get(SnackbarService).openSnackBar(message, 'Chiudi', SNACKBAR.DANGER);
  }
}
