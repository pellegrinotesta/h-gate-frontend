import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EMPTY, Observable, of } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { AuthService } from './auth.service';
import { BaseAuthFacadeService } from '../../base/authentication/services/facade/base-auth-facade.service';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';



@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService extends BaseAuthFacadeService {
  constructor(private readonly jwtHelperService: JwtHelperService, private authService: AuthService) {
    super();
  }

  getUser(): Observable<AuthenticatedUser> {
    const user = localStorage.getItem('encryptedUser');
    if (user != undefined) {
      let jsonObject = JSON.parse(user);
      let authenticationValue = jsonObject.authentication;

      let encryptedUser =  { 
        'authentication' : authenticationValue
      };

      const userString = this.authService.decrypt(encryptedUser);
      const userStringDecoded = this.decodeJWT(userString)
      if (userStringDecoded)
        return of(userStringDecoded);
    }
    return EMPTY;
  }

  @Memoize()
  private decodeJWT(user: AuthenticatedUser): AuthenticatedUser | null {
    const authenticatedUser = this.jwtHelperService.decodeToken<AuthenticatedUser>(user.authentication);
    if(!authenticatedUser)
      return null;
    authenticatedUser.roles = authenticatedUser.authorities;
    return authenticatedUser;
  }
}
