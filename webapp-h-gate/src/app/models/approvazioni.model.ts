export interface MedicoInAttesa {
  medicoId: number;
  userId: number;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  specializzazione: string;
  numeroAlbo: string;
  universita?: string;
  annoLaurea?: number;
  dataRegistrazione?: string;
}

export type StatoRichiesta = 'IN_ATTESA' | 'APPROVATA' | 'RIFIUTATA';

export interface RichiestaAssociazione {
  id: number;
  stato: StatoRichiesta;
  relazione: string;
  createdAt: string;
  dataGestione?: string;
  motivoRifiuto?: string;
  tutoreUserId: number;
  tutoreNome: string;
  tutoreCognome: string;
  tutoreEmail: string;
  tutoreTelefono?: string;
  pazienteId: number;
  pazienteNome: string;
  pazienteCognome: string;
  pazienteCodiceFiscale: string;
  pazienteDataNascita?: string;
  tutoriAttuali: string[];
}

export interface ApprovazioniConteggio {
  mediciInAttesa: number;
  associazioniInAttesa: number;
}
