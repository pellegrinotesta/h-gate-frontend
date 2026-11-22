import { readStoredUser } from './auth.service';

describe('readStoredUser', () => {
  const KEY = 'encryptedUser';
  // JWT fittizio: header.payload.firma (il contenuto non viene verificato lato client)
  const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.c2lnbmF0dXJl';

  afterEach(() => localStorage.removeItem(KEY));

  it('restituisce l\'utente se il token è un JWT', () => {
    localStorage.setItem(KEY, JSON.stringify({ authentication: JWT }));
    expect(readStoredUser()?.authentication).toBe(JWT);
  });

  it('scarta i vecchi token cifrati e pulisce lo storage', () => {
    localStorage.setItem(KEY, JSON.stringify({ authentication: 'U2FsdGVkX1+abc/def==' }));
    expect(readStoredUser()).toBeUndefined();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('scarta valori corrotti', () => {
    localStorage.setItem(KEY, '{non json');
    expect(readStoredUser()).toBeUndefined();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('restituisce undefined se non c\'è nulla', () => {
    expect(readStoredUser()).toBeUndefined();
  });
});
