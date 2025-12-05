import { User } from "./user.model";

export interface Medico extends User {
  specializzazione: string;
  numeroAlbo: string;
  universita?: string;
  annoLaurea?: number;
  bio?: string;
  curriculum?: string;
  durataVisitaMinuti: number;
  isDisponibile: boolean;
  isVerificato: boolean;
  ratingMedio: number;
  numeroRecensioni: number;
  numeroPazienti: number;
}