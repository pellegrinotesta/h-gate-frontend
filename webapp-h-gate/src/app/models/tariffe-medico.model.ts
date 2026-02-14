import { Medico } from "./medico.model";

export interface TariffeMedico {
    id?: number;
    medico: Medico;
    tipoVisita: string;
    costo: number;
    isPrimaVisita: boolean;
    durataMinuti: number;
    isAttivo: boolean;
    createdAt: string;
}