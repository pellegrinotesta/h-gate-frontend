import { BaseUser } from "../models/base-user.model";
import { LogicalOperator } from "../types/logical-operator.type";

/**
 * BaseAuthService è la classe che si occupa di gestire il login dell'utente e di controllare se l'utente possiede uno o più ruoli.
 *
 * Per utilizzare BaseAuthService nel proprio modulo è necessario definire un provider per BaseAuthService
 * attraverso l'interfaccia corrispondente.
 *
 * esempio:
 * {provide: BaseAuthService, useClass: <PropriaImplementazione>}
 *
 * - <PropriaImplementazione>: è la classe che estende BaseAuthService
 * - provide: viene utilizzata da angular come chiave per configurare ed iniettare la dipendenza
 * La seconda proprietà (nell'esempio useClass) serve ad indicare ad angular come creare il valore della dipendenza
 *
 * tip: si potrebbe fare cache sul risultato di checkRoleInList con strumenti simili a memoize
 */
export abstract class BaseAuthService {
    
    abstract isLogged(): boolean;
    abstract login(): void;
    abstract logout(): void;
    abstract storeUser<U extends BaseUser>(user: U): void;

    hasRole<U extends BaseUser>(roles: string[], user: U, logicalOperator: LogicalOperator): boolean {
        if (!user?.roles?.length) {
            return false;
        }
        return this.checkRoleInList(roles, user.roles, logicalOperator);
    }

    checkRoleInList(source: string[], target: string[], logicalOperator: LogicalOperator): boolean {
        if (logicalOperator === 'OR') {
            return source.some(role => target.includes(role));
        }
        else if (logicalOperator === 'NOT') {
            return !source.some(role => target.includes(role));
        }
        return source.every(role => target.includes(role));
    }
}
