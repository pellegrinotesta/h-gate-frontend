export interface AgendaMedico {
    id?: number;
    eventoId: number;
    inizio: string;
    fine: string;
    medicoId: number;
    medicoNome: string;
    specializzazione: string;
    pazienteId: number;
    pazienteNome: string;
    tutoreNome?: string;
    tutoreTelefono?: string;
    tipoVisita: string;
    stato: string;
    isPrimaVisita: boolean;
    notePaziente: string;
    promemoriaInviato: boolean;
    confermaInviata: boolean;

}