import { errorMessage } from './error-message';

describe('errorMessage', () => {
  it('usa il messaggio del server quando c\'è', () => {
    expect(errorMessage('Orario non disponibile', 'fallback')).toBe('Orario non disponibile');
  });

  it('ignora gli statusText HTTP generici', () => {
    expect(errorMessage('Bad Request', 'Errore nel salvataggio')).toBe('Errore nel salvataggio');
    expect(errorMessage('Internal Server Error', 'Errore')).toBe('Errore');
  });

  it('spiega quando il server non è raggiungibile', () => {
    expect(errorMessage('Unknown Error', 'Errore')).toContain('connessione');
  });

  it('legge anche un HttpErrorResponse non trasformato', () => {
    expect(errorMessage({ error: { message: 'Dati non validi' } }, 'x')).toBe('Dati non validi');
  });

  it('usa il fallback per valori vuoti o sconosciuti', () => {
    expect(errorMessage('', 'fallback')).toBe('fallback');
    expect(errorMessage(undefined, 'fallback')).toBe('fallback');
    expect(errorMessage({}, 'fallback')).toBe('fallback');
  });
});
