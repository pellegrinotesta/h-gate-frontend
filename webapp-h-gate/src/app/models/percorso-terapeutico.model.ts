export interface PercorsoTerapeutico {
    id: number;
    pazienteId: number;
    medicoId: number;
    titolo: string;
    obiettivi?: string;
    dataInizio: Date;
    dataFinePrevista?: Date;
    stato: 'ATTIVO' | 'CONCLUSO' | 'SOSPESO';
    numeroSedutePreviste?: number;
    numeroSeduteEffettuate?: number;
    medico?: {
        nome: string;
        cognome: string;
    };
}