export interface ValutazionePsicologica {
    id: number;
    pazienteId: number;
    medicoId: number;
    dataValutazione: Date;
    tipoTest: string;
    punteggi?: Record<string, any>;
    interpretazione?: string;
    medico?: {
        nome: string;
        cognome: string;
    };
}