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


export interface PrenotazioneCreate {
    pazienteId: number;
    medicoId: number;
    dataOra: string;
    tipoVisita: string;
    note?: string;
    costo?: number;
    isPrimaVisita?: boolean;
}

export interface SlotDisponibile {
    dataOra: string;
    disponibile: boolean;
    motivoNonDisponibilita?: string;
}

export interface SlotDisponibili {
    medicoId: number;
    medicoNome: string;
    data: string;
    slots: SlotDisponibile[];
    message?: string;
    orarioInizio?: string;
    orarioFine?: string;
}


    