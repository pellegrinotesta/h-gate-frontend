import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { cacheInterceptorFn, clearHttpCache } from './cache.interceptor';

describe('cacheInterceptorFn', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  const URL = '/api/paziente/advanced-search';

  beforeEach(() => {
    clearHttpCache();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([cacheInterceptorFn])), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('utenti diversi non condividono i risultati in cache', () => {
    http.post(URL, {}, { headers: { Authorization: 'Bearer utenteA' } }).subscribe();
    httpMock.expectOne(URL).flush({ data: 'pazienti di A' });

    let risultatoB: unknown;
    http.post(URL, {}, { headers: { Authorization: 'Bearer utenteB' } }).subscribe(r => risultatoB = r);
    // Deve partire una nuova richiesta: non va restituita la cache dell'utente A
    httpMock.expectOne(URL).flush({ data: 'pazienti di B' });
    expect(risultatoB).toEqual({ data: 'pazienti di B' });
  });

  it('lo stesso utente riusa la cache, che si svuota al logout', () => {
    http.post(URL, {}, { headers: { Authorization: 'Bearer utenteA' } }).subscribe();
    httpMock.expectOne(URL).flush({ data: 1 });

    http.post(URL, {}, { headers: { Authorization: 'Bearer utenteA' } }).subscribe();
    httpMock.expectNone(URL);

    clearHttpCache();
    http.post(URL, {}, { headers: { Authorization: 'Bearer utenteA' } }).subscribe();
    httpMock.expectOne(URL).flush({ data: 2 });
  });
});
