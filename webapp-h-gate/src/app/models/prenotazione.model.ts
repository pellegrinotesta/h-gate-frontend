import { Medico } from "./medico.model";
import { Paziente } from "./paziente.model";
import { Referto } from "./referto.model";
import { User } from "./user.model";

export interface Prenotazione {
    id: number;
    uuid?: string;
    numeroPrenotazione: string;
    dataOra: string;
    dataOraFine?: string;
    tipoVisita: string;
    stato: 'IN_ATTESA' | 'CONFERMATA' | 'COMPLETATA' | 'ANNULLATA' | 'NON_PRESENTATO';
    costo: number;
    pazienteNomeCompleto: string;
    medicoNomeCompleto: string;
    tutoreNomeCompleto: string;
    paziente?: Paziente;
    createdByUserId?: User;
    medico?: Medico;
    notePaziente?: string;
    noteMedico?: string;
    isPrimaVisita: boolean;
    isUrgente: boolean;
    promemoriaInviato: boolean;
    confermaInviata: boolean;
    dataAnnullamento?: string;
    motivoAnnullamento?: string;
    annullataDa?: User;
    referto?: Referto;
    diagnosi?: string;
    recensione?: string;
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


