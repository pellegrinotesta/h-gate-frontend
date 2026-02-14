import { Prenotazione } from "./prenotazione.model";

export interface DashboardMedicoResponse {
    nomeMedico: string;
    visiteOggi: number;
    pazientiTotali: number;
    refertiDaFirmare: number;
    refertiDaCOmpletare: number;
    ratingMedio: number;
    numeroRecensioni: number;
    appuntamentiOggi: Prenotazione[];

}