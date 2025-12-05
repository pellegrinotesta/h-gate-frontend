import { User } from "./user.model";

export interface Amministratore extends User {
    livelloAccesso: number;
    dipartimento?: string;
    permessi?: Record<string, boolean>;
}