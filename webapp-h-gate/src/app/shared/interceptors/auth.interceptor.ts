import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

    const storedUser = localStorage.getItem('encryptedUser');
    let token: string | null = null;

    if (storedUser) {
        const user = JSON.parse(storedUser);
        token = user.authentication;      // <── QUI il vero token criptato
    }

    const authReq = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authReq);
}
