import { UserRole } from "../shared/enums/user-role.enum";
import { BaseModel } from "../shared/models/base-model";

export interface User extends BaseModel {
    uuid: string;
    email: string;
    nome: string;
    cognome: string;
    telefono: string;
    dataNascita: Date;
    indirizzo: string;
    citta: string;
    cap: string;
    provincia: string;
    roles: UserRole[];
    active: boolean;
    verified: boolean;

}