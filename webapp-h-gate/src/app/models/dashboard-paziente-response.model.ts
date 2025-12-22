import { PrenotazioneDettagliata } from "./prenotazione-dettagliata.model";
import { Referto } from "./referto.model";

export interface DashboardPazienteResponse {
    prossimiAppuntamenti: number;
    visiteTotali: number;
    prenotazioni: PrenotazioneDettagliata[];
    referti: Referto[];
}