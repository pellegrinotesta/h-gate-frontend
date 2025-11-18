import { Observable } from "rxjs";
import { BaseUser } from "../../models/base-user.model";

/**
 * Per utilizzare BaseAuthFacade nel proprio modulo è necessario definire un provider per BaseAuthFacade
 * attraverso l'interfaccia corrispondente.
 *
 * esempio:
 * {provide: BaseAuthService, useClass: PropriaImplementazione}
 *
 * - PropriaImplementazione: è la classe che estende BaseAuthFacade
 * - provide: viene utilizzata da angular come chiave per configurare ed iniettare la dipendenza
 * La seconda proprietà (nell'esempio useClass) serve ad indicare ad angular come creare il valore della dipendenza
 */
export abstract class BaseAuthFacadeService {
    abstract getUser(): Observable<BaseUser>;
}