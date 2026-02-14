import { User } from "./user.model";

export interface Paziente extends User {
    id: number;
    nome: string;
    cognome: string;
    sesso: string;
    dataNascita: Date;
    citta: string;
    codiceFiscale: string;
    gruppoSanguigno?: string;
    altezzaCm?: number;
    pesoKg?: number;
    allergie?: string;
    patologieCroniche?: string;
    noteMediche?: string;
    consensoPrivacy: boolean;
    consensoMarketing: boolean;
}