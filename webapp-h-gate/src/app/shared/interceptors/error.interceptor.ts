import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { SNACKBAR } from '../enums/snackbar-class.enum';

const postWithoutConfirm = ['check-tags'];

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

    const snackBar = inject(SnackbarService);
    //const userService = inject(UserService);

    return next(req).pipe(
        catchError((res) => {
        if ([401].includes(res.status)) {
            snackBar.openSnackBar('Non Autorizzato', 'Chiudi', SNACKBAR.DANGER);
            //userService.logout();
        }
        else if ([403].includes(res.status)) {
            snackBar.openSnackBar('Non Autorizzato', 'Chiudi', SNACKBAR.DANGER);
        }
        else {
            snackBar.openSnackBar(res.error.message ?? 'Operazione Fallita!', 'Chiudi', SNACKBAR.DANGER);
        }

        const error = (res && res.error && res.error.message) || res.statusText;
        return throwError(() => error);
        }),
        map((res) => {
            // 4 = HttpEventType.Response
            if (res.type === 4 && 'body' in res && typeof res.body === 'object') {
                if (res.status === 204) {
                    snackBar.openSnackBar('Eliminato con successo', 'Ok', SNACKBAR.SUCCESS);
                    return res;
                }
                const body = res.body as { message?: string, response_code?: number, data?: any };
                if (body.response_code && body.response_code >= 400)
                    snackBar.openSnackBar(body.message?.toString() ?? 'Operazione Fallita!', 'Chiudi', SNACKBAR.DANGER);
                if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && !postWithoutConfirm.some(x => req.url.includes(x)))
                    snackBar.openSnackBar('Operazione eseguita con successo', 'Ok', SNACKBAR.SUCCESS);
            }
            return res;
        })
    );
}