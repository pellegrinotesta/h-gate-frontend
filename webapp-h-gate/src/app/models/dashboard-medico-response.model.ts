import { Prenotazione } from "./prenotazione.model";

export interface DashboardMedicoResponse {
    visiteOggi: number;
    pazientiTotali: number;
    refertiDaFirmare: number;
    refertiDaCOmpletare: number;
    ratingMedio: number;
    numeroRecensioni: number;
    appuntamentiOggi: Prenotazione[];

}