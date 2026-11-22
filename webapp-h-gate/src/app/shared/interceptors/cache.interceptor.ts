import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const cache = new Map<string, { response: HttpResponse<any>, expiry: number }>();

/** Svuota la cache (da chiamare al logout). */
export function clearHttpCache(): void {
  cache.clear();
}

export function cacheInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  let getCacheKey = (req: HttpRequest<any>): string => {
    // Il token fa parte della chiave: utenti diversi sullo stesso browser non condividono i risultati
    return `${req.headers.get('Authorization') ?? ''}|${req.urlWithParams}-${JSON.stringify(req.body || {})}`;
  }

  if (!req.url.includes('advanced-search') && !req.url.includes('inpadocFamiliesInvolved'))
    return next(req);

  const cacheKey = getCacheKey(req);
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse && cachedResponse.expiry > Date.now())
    return of(cachedResponse.response);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(cacheKey, { response: event, expiry: Date.now() + 5 * 60 * 1000 });
      }
    })
  );
}
