import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { RoutesEnum } from "../enums/routes.enum";
import { AuthService } from "../services/auth/auth.service";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authService;
    protected saveRedirectUrl: boolean;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.saveRedirectUrl = true;
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isLogged()) {
            return true;
        }
        else {
            if (this.saveRedirectUrl) {
                sessionStorage.setItem('auth:redirect', state?.url?.toString());
            }
            this.authService.login();
            return false;
        }
    }
}

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    return inject(AuthGuard).canActivate(route, state);
};