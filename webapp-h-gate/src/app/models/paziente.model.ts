import { User } from "./user.model";

export interface Paziente extends User {
    id: number;
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