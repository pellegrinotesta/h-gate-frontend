export interface ConsensoEvento {
  id: number;
  tipo: 'PRIVACY_SANITARIA';
  concesso: boolean;
  versioneInformativa: string;
  dataEvento: string;
  espressoDa?: string;
  note?: string;
}

export interface StatoConsenso {
  pazienteId: number;
  pazienteNome: string;
  pazienteCognome: string;
  attivo: boolean;
  aggiornato: boolean;
  versioneConsenso?: string;
  versioneCorrente: string;
  dataEvento?: string;
  espressoDa?: string;
  storico?: ConsensoEvento[];
}

export type AzioneAudit = 'LETTURA' | 'CREAZIONE' | 'MODIFICA' | 'ELIMINAZIONE' | 'DOWNLOAD'
  | 'LOGIN' | 'LOGIN_FALLITO' | 'LOGIN_BLOCCATO';
export type EsitoAudit = 'OK' | 'NEGATO' | 'ERRORE';

export interface AccessoPaziente {
  dataEvento: string;
  utente: string;
  ruolo: string;
  azione: AzioneAudit;
  risorsaTipo: string;
  esito: EsitoAudit;
}

export interface AuditRiga {
  id: number;
  dataEvento: string;
  userId?: number;
  userEmail?: string;
  utenteNome?: string;
  ruoli?: string;
  azione: AzioneAudit;
  esito: EsitoAudit;
  risorsaTipo?: string;
  risorsaId?: number;
  pazienteId?: number;
  pazienteNome?: string;
  httpStatus?: number;
  httpMethod?: string;
  path?: string;
  ipAddress?: string;
}

export interface Pagina<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface FiltriAudit {
  email?: string;
  codiceFiscale?: string;
  azione?: AzioneAudit | '';
  esito?: EsitoAudit | '';
  da?: string;
  a?: string;
}

export const AZIONI_LEGGIBILI: Record<AzioneAudit, string> = {
  LETTURA: 'Consultazione',
  CREAZIONE: 'Inserimento',
  MODIFICA: 'Modifica',
  ELIMINAZIONE: 'Eliminazione',
  DOWNLOAD: 'Download',
  LOGIN: 'Accesso',
  LOGIN_FALLITO: 'Accesso fallito',
  LOGIN_BLOCCATO: 'Accesso bloccato'
};

export const RISORSE_LEGGIBILI: Record<string, string> = {
  PAZIENTE: 'Scheda paziente',
  CARTELLA_CLINICA: 'Cartella clinica (PDF)',
  REFERTO: 'Referto',
  PRENOTAZIONE: 'Prenotazione',
  ALLEGATO: 'Allegato',
  PERCORSO: 'Percorso terapeutico',
  VALUTAZIONE: 'Valutazione psicologica',
  AGENDA: 'Agenda',
  CONSENSO: 'Consensi',
  APPROVAZIONE: 'Approvazioni',
  REGISTRO_ACCESSI: 'Registro accessi',
  AUTENTICAZIONE: 'Login'
};
