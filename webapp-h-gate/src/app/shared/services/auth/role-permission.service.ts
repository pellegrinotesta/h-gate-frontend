import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { HttpBaseService } from '../base/http-base.service';
import { environment } from '../../../../environment/environment';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService extends HttpBaseService<any> {

  constructor(injector: Injector,
    private readonly authService: AuthService,) {
    super(injector, environment.endpoints.roles);
  }

  public hasPermission(roles: string[] | undefined): boolean {
    if (roles === undefined || roles.length === 0) {
      return true;
    } else {
      const userAuthorities = this.getUserRole();
      return roles.some(role => userAuthorities.includes(role));
    }
  }

  getUserRole(): string[] {
    let userStored: AuthenticatedUser | undefined = this.authService.getStoredUsed();
    const user: AuthenticatedUser | undefined = userStored ? jwtDecode(userStored.authentication) : undefined;
    if (user)
      return user.authorities;
    return [];
  }
}
