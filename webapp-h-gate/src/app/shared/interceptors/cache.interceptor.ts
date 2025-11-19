import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const cache = new Map<string, { response: HttpResponse<any>, expiry: number }>();

export function cacheInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  let getCacheKey = (req: HttpRequest<any>): string => {
    return `${req.urlWithParams}-${JSON.stringify(req.body || {})}`;
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
