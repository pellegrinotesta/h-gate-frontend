/** Messaggi HTTP standard (statusText) che non dicono nulla all'utente. */
const MESSAGGI_GENERICI = new Set([
  'Unknown Error', 'OK', 'Bad Request', 'Unauthorized', 'Forbidden', 'Not Found',
  'Conflict', 'Internal Server Error', 'Bad Gateway', 'Service Unavailable', 'Gateway Timeout'
]);

/**
 * Restituisce il messaggio d'errore del server, se disponibile, altrimenti il fallback.
 * TokenExpiredInterceptor trasforma gli errori HTTP nella stringa `error.message` del corpo
 * della risposta (o nello statusText se manca).
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'string') {
    const msg = err.trim();
    if (msg && !MESSAGGI_GENERICI.has(msg)) return msg;
    if (msg === 'Unknown Error') return 'Impossibile contattare il server. Controlla la connessione.';
  }
  if (err && typeof err === 'object' && 'error' in err) {
    const inner = (err as { error?: { message?: unknown } }).error;
    if (inner && typeof inner.message === 'string' && inner.message.trim()) return inner.message;
  }
  return fallback;
}
