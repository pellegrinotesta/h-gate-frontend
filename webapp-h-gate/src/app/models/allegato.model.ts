import { Prenotazione } from "./prenotazione.model";

export interface Allegato {
    id: number;
    uuid: string;
    nomeFile: string;
    tipoFile: string;
    mimeType: string;
    sizeBytes: number;
    url: string;
    storagePath: string;
    descrizione: string;
    hashFile: string;
    uploadedAt: string;
    prenotazione: Prenotazione;
}