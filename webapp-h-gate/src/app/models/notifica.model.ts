export interface Notifica {
    id: number;
    userId: number;
    tipo: TipoNotifica;
    titolo: string;
    messaggio: string;
    link?: string;
    isLetta: boolean;
    dataLettura?: string;
    isInviataEmail: boolean;
    dataInvioEmail?: string;
    createdAt: string;
}

export enum TipoNotifica {
    NUOVA_PRENOTAZIONE = 'NUOVA_PRENOTAZIONE',
    CONFERMA_PRENOTAZIONE = 'CONFERMA_PRENOTAZIONE',
    RIFIUTO_PRENOTAZIONE = 'RIFIUTO_PRENOTAZIONE',
    ANNULLAMENTO_PRENOTAZIONE = 'ANNULLAMENTO_PRENOTAZIONE',
    PROMEMORIA = 'PROMEMORIA',
    NUOVO_REFERTO = 'NUOVO_REFERTO',
    BENVENUTO = 'BENVENUTO',
    VERIFICA_ACCOUNT = 'VERIFICA_ACCOUNT',
    RESET_PASSWORD = 'RESET_PASSWORD',
    VERIFICA_MEDICO = 'VERIFICA_MEDICO',
    APPROVAZIONE_MEDICO = 'APPROVAZIONE_MEDICO',
    RIFIUTO_MEDICO = 'RIFIUTO_MEDICO',
    PAGAMENTO_RICEVUTO = 'PAGAMENTO_RICEVUTO',
    PAGAMENTO_FALLITO = 'PAGAMENTO_FALLITO',
    SISTEMA = 'SISTEMA',
    PROMOZIONALE = 'PROMOZIONALE'
}

export const TipoNotificaLabels: Record<TipoNotifica, string> = {
    [TipoNotifica.NUOVA_PRENOTAZIONE]: 'Nuova prenotazione',
    [TipoNotifica.CONFERMA_PRENOTAZIONE]: 'Prenotazione confermata',
    [TipoNotifica.RIFIUTO_PRENOTAZIONE]: 'Prenotazione rifiutata',
    [TipoNotifica.ANNULLAMENTO_PRENOTAZIONE]: 'Prenotazione annullata',
    [TipoNotifica.PROMEMORIA]: 'Promemoria',
    [TipoNotifica.NUOVO_REFERTO]: 'Nuovo referto',
    [TipoNotifica.BENVENUTO]: 'Benvenuto',
    [TipoNotifica.VERIFICA_ACCOUNT]: 'Verifica account',
    [TipoNotifica.RESET_PASSWORD]: 'Reset password',
    [TipoNotifica.VERIFICA_MEDICO]: 'Verifica documenti',
    [TipoNotifica.APPROVAZIONE_MEDICO]: 'Account approvato',
    [TipoNotifica.RIFIUTO_MEDICO]: 'Account rifiutato',
    [TipoNotifica.PAGAMENTO_RICEVUTO]: 'Pagamento ricevuto',
    [TipoNotifica.PAGAMENTO_FALLITO]: 'Pagamento fallito',
    [TipoNotifica.SISTEMA]: 'Notifica di sistema',
    [TipoNotifica.PROMOZIONALE]: 'Comunicazione'
};

export const TipoNotificaIcons: Record<TipoNotifica, string> = {
    [TipoNotifica.NUOVA_PRENOTAZIONE]: 'event_note',
    [TipoNotifica.CONFERMA_PRENOTAZIONE]: 'event_available',
    [TipoNotifica.RIFIUTO_PRENOTAZIONE]: 'event_busy',
    [TipoNotifica.ANNULLAMENTO_PRENOTAZIONE]: 'cancel',
    [TipoNotifica.PROMEMORIA]: 'notifications',
    [TipoNotifica.NUOVO_REFERTO]: 'description',
    [TipoNotifica.BENVENUTO]: 'waving_hand',
    [TipoNotifica.VERIFICA_ACCOUNT]: 'verified_user',
    [TipoNotifica.RESET_PASSWORD]: 'lock_reset',
    [TipoNotifica.VERIFICA_MEDICO]: 'badge',
    [TipoNotifica.APPROVAZIONE_MEDICO]: 'check_circle',
    [TipoNotifica.RIFIUTO_MEDICO]: 'cancel',
    [TipoNotifica.PAGAMENTO_RICEVUTO]: 'paid',
    [TipoNotifica.PAGAMENTO_FALLITO]: 'error',
    [TipoNotifica.SISTEMA]: 'info',
    [TipoNotifica.PROMOZIONALE]: 'campaign'
};