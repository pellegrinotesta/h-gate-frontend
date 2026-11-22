import { inject, Injectable } from '@angular/core';
import { LogicalOperator } from '../../base/authentication/types/logical-operator.type';
import { BaseAuthService } from '../../base/authentication/services/base-auth.service';
import { Router } from '@angular/router';
import { Memoize } from 'typescript-memoize';
import { BaseUser } from '../../base/authentication/models/base-user.model';
import { Subject } from 'rxjs';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';
import { MinoriStateService } from '../minore.service';
import { clearHttpCache } from '../../interceptors/cache.interceptor';


const STORAGE_KEY = 'encryptedUser';

function isJwt(token: unknown): token is string {
  return typeof token === 'string' && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token);
}

/**
 * Legge l'utente salvato (con il JWT in `authentication`) senza dipendenze da servizi,
 * così può essere usata anche negli interceptor HTTP.
 * I token salvati da versioni precedenti (cifrati lato server) non sono JWT validi:
 * in quel caso si pulisce lo storage e l'utente dovrà rifare il login.
 */
export function readStoredUser(): AuthenticatedUser | undefined {
  const storedUser = localStorage.getItem(STORAGE_KEY);
  if (!storedUser) {
    return undefined;
  }
  try {
    const user = JSON.parse(storedUser) as AuthenticatedUser;
    if (isJwt(user?.authentication)) {
      return user;
    }
  } catch {
    // valore corrotto: trattato come assente
  }
  localStorage.removeItem(STORAGE_KEY);
  return undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService{

    userLoggedIn: Subject<boolean> = new Subject<boolean>(); 
    private minoriState = inject(MinoriStateService);

    constructor(private readonly router: Router) {
      super();
    }
  
    login(): void {
      this.router.navigate(['auth']);
    }
  
    logout(): void {
      this.minoriState.clear(); 
      clearHttpCache();
      localStorage.removeItem('encryptedUser');
      localStorage.removeItem('permissions');
      this.userLoggedIn.next(false);
      this.login();
    }
  
    isLogged(): boolean {
      return !!this.getEncryptedStoredUsed();
    }
  
    storeUser<U extends BaseUser>(encryptedUser: U): void {
      localStorage.setItem('encryptedUser', JSON.stringify(encryptedUser));
      this.userLoggedIn.next(true);
    }
  
    getEncryptedStoredUsed(): AuthenticatedUser | undefined {
      return readStoredUser();
    }

    getStoredUsed(): AuthenticatedUser | undefined {
      return this.getEncryptedStoredUsed();
    }

    /**
     * Il server ora restituisce un JWT firmato in chiaro: non c'è più nulla da decifrare.
     * Il metodo resta per compatibilità con i chiamanti esistenti.
     */
    decrypt(encryptedData: any): any {
      return {
        'authentication': encryptedData?.['authentication']
      };
    }

    @Memoize((roles: string[], user: AuthenticatedUser, logicalOperator: LogicalOperator) => {
      return `${roles.toString()}:${user.roles?.toString()}:${logicalOperator.toString()}`;
    })
    override hasRole<U extends BaseUser>(
      roles: string[],
      user: U,
      logicalOperator: LogicalOperator
    ): boolean {
      return super.hasRole(roles, user, logicalOperator);
    }
}
