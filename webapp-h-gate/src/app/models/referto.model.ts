export interface Referto {
    id: number;
    titolo: string;
    dataEmissione: Date;
    tipoReferto: string;
    medico: {
        nome: string;
        cognome: string;
        specializzazione: string;
    };
    diagnosi: string;
    hasAllegati: boolean;
}

export interface RefertoCreate {
    id?: number;
    prenotazioneId?: number;
    tipoReferto: string;
    titolo: string;
    anamnesi?: string;
    esameObiettivo?: string;
    diagnosi: string;
    terapia?: string;
    prescrizioni?: string;
    noteMediche?: string;
    parametriVitali?: ParametriVitali;
    esamiRichiesti?: string;
    prossimoControllo?: string; // LocalDate → stringa ISO
}

export interface ParametriVitali {
    pressioneSistolica?: number;
    pressioneDiastolica?: number;
    frequenzaCardiaca?: number;
    temperatura?: number;
    peso?: number;
    altezza?: number;
    saturazione?: number;
}