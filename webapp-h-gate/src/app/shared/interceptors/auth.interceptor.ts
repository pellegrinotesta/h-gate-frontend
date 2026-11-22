import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { readStoredUser } from '../services/auth/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    // readStoredUser() scarta automaticamente token non validi (es. vecchi token cifrati)
    const token = readStoredUser()?.authentication;

    const authReq = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authReq);
}
