export interface Prenotazione {
    id: number;
    numeroPrenotazione: string;
    dataOra: Date;
    tipoVisita: string;
    stato: 'IN_ATTESA' | 'CONFERMATA' | 'COMPLETATA' | 'ANNULLATA';
    paziente?: {
        id: number;
        nome: string;
        cognome: string;
        codiceFiscale: string;
    };
    medico?: {
        nome: string;
        cognome: string;
        specializzazione: string;
    };
    note?: string;
}