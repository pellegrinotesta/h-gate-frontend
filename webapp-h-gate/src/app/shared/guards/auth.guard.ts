import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { RoutesEnum } from "../enums/routes.enum";

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const isLogged = localStorage.getItem('adisurc_token') !== null;
    if(!isLogged) {
        const router = inject(Router);
        router.navigate([RoutesEnum.LOGIN]);
    }

    return isLogged;
}