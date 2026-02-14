import { StatisticheGenerali } from "./statistiche-generali.model";

export interface DashboardAdminResponse {
    pazientiAttivi: number;
    mediciAttivi: number;
    prenotazioniOggi: number;
    fatturatoMensile: number;
    mediciDaVerificare: number;
    refertiInSospeso: number;
    statistiche: StatisticheGenerali
}