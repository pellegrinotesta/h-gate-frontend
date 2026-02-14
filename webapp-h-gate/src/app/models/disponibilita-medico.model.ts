export interface DisponibilitaMedico {
    id?: number;
    medicoId: number;
    giornoSettimana: number; // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
    giornoData?: string; // Data specifica (opzionale, in formato ISO)
    oraInizio: string; // Formato HH:mm
    oraFine: string;   // Formato HH:mm
    isAttiva: boolean;
    note?: string;
}

export const GIORNI_SETTIMANA = [
    { valore: 0, nome: 'Domenica' },
    { valore: 1, nome: 'Lunedì' },
    { valore: 2, nome: 'Martedì' },
    { valore: 3, nome: 'Mercoledì' },
    { valore: 4, nome: 'Giovedì' },
    { valore: 5, nome: 'Venerdì' },
    { valore: 6, nome: 'Sabato' }
]

export function getGiornoNome(giornoSettimana: number): string {
    const giorno = GIORNI_SETTIMANA.find(g => g.valore === giornoSettimana);
    return giorno?.nome || 'Non valido';
}