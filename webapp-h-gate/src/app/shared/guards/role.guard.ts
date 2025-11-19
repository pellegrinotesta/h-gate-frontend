import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { concatMap, Observable, of } from "rxjs";
import { AuthFacadeService } from "../services/auth/auth-facade.service";
import { AuthService } from "../services/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

   private authService;
    private authFacade;

    constructor(authService: AuthService, authFacade: AuthFacadeService) {
        this.authService = authService;
        this.authFacade = authFacade;
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const roles = this.getRolesFromRoute(route);
        const logicalOp = this.getLogicalOperatorFromRoute(route);
        console.log('[RoleGuard] roles:', roles, 'logicalOp:', logicalOp);
        return this.authFacade.getUser().pipe(concatMap((user) => {
            console.log('[RoleGuard] user:', user);
            const hasRole = roles?.length > 0 && !!user && this.authService.hasRole(roles, user, logicalOp);
            console.log('[RoleGuard] access granted?', hasRole);
            return of(hasRole);
        }));
    }
    

    getRolesFromRoute(route: ActivatedRouteSnapshot) {
        const rolesAttributeName = this.getRolesAttributeName();
        return route.data[rolesAttributeName];
    }

    getLogicalOperatorFromRoute(route: ActivatedRouteSnapshot) {
        const logicalOperatorAttributeName = this.getLogicalOperatorAttributeName();
        return route.data[logicalOperatorAttributeName] || "OR";
    }

    getRolesAttributeName(): string {
        return 'roles';
    }
    
    getLogicalOperatorAttributeName(): string {
        return 'logicalOperator';
    }
}

export const roleGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    return inject(RoleGuard).canActivate(route, state);
};
