import { KpiData } from "./kpi-data.model";
import { StatCard } from "./stat-card.model";

export interface DashboardAdminResponse {
    kpi: KpiData;
    stats: StatCard[];
    mediciDaVerificare: MedicoDaVerificare[];
    attivitaRecenti: AttivitaRecente[];
}

export interface MedicoDaVerificare {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    specializzazione: string;
    numeroAlbo: string;
    universita?: string;
    annoLaurea?: number;
    createdAt: string;
    hasDocuments: boolean;
  }
  
  // ==================== ATTIVITA RECENTE ====================
  
  export interface AttivitaRecente {
    id: number;
    action: string;
    time: string;
    icon: string;
    type: 'primary' | 'success' | 'warning' | 'info' | 'error' | 'secondary';
  }
  
  // ==================== PRENOTAZIONE PER GIORNO ====================
  
  export interface PrenotazionePerGiorno {
    nome: string;
    valore: number;
  }
  
  // ==================== SPECIALIZZAZIONE RICHIESTA ====================
  
  export interface SpecializzazioneRichiesta {
    nome: string;
    valore: number;
  }
  
  // ==================== STATISTICHE AVANZATE ====================
  
  export interface StatisticheAvanzate {
    prenotazioniPerGiorno: PrenotazionePerGiorno[];
    specializzazioniTop: SpecializzazioneRichiesta[];
  }

  export interface RifiutaMedicoRequest {
    motivo: string;
  }
  