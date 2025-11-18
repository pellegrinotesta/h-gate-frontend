import { Injectable } from '@angular/core';
import { LogicalOperator } from '../../base/authentication/types/logical-operator.type';
import { BaseAuthService } from '../../base/authentication/services/base-auth.service';
import { Router } from '@angular/router';
import { Memoize } from 'typescript-memoize';
import { BaseUser } from '../../base/authentication/models/base-user.model';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';
import { environment } from '../../../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService{

    userLoggedIn: Subject<boolean> = new Subject<boolean>(); 

    constructor(private readonly router: Router) {
      super();
    }
  
    login(): void {
      this.router.navigate(['auth']);
    }
  
    logout(): void {
      localStorage.removeItem('encryptedUser');
      localStorage.removeItem('permissions');
      this.userLoggedIn.next(false);
      this.login();
    }
  
    isLogged(): boolean {
      return !!localStorage.getItem('encryptedUser');
    }
  
    storeUser<U extends BaseUser>(encryptedUser: U): void {
      localStorage.setItem('encryptedUser', JSON.stringify(encryptedUser));
      this.userLoggedIn.next(true);
    }
  
    getEncryptedStoredUsed(): AuthenticatedUser | undefined {
  
      const storedUser = localStorage.getItem('encryptedUser');
      return storedUser ? (JSON.parse(storedUser) as AuthenticatedUser) : undefined;
    }
  
    getStoredUsed(): AuthenticatedUser | undefined {
      const encryptedUserAsString = localStorage.getItem('encryptedUser');
  
      if(encryptedUserAsString != undefined){
  
        let jsonObject = JSON.parse(encryptedUserAsString);
        let authenticationValue = jsonObject.authentication;
  
        let encryptedUser =  { 
          'authentication' : authenticationValue
        };
  
        return this.decrypt(encryptedUser);
      }
      
      return undefined;
    }
  
    decrypt(encryptedData: any): any {
  
      let jwt : string = encryptedData['authentication'];
  
      let keyForCryptoJS = CryptoJS.enc.Utf8.parse(environment.jwt.encryptionKey);
      
      let encryptString = jwt;
      let decodeBase64 = CryptoJS.enc.Base64.parse(encryptString)
      
      let cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: decodeBase64
      });
  
    
      let decryptedData = CryptoJS.AES.decrypt(
        cipherParams,
        keyForCryptoJS,
        {
          mode: CryptoJS.mode.ECB
        }
      );
    
      let decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
  
      return { 
        'authentication' : decryptedText
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
