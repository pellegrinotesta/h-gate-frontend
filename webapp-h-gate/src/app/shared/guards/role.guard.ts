import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { AuthenticatedUser } from "../../models/authenticated-user.model";
import { RoutesEnum } from "../enums/routes.enum";

@Injectable({
    providedIn: 'root'
})
export class RoleGuard {

    currentUser: User | undefined;

    readonly userService = inject(UserService);
    readonly router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const currentUserInfo: AuthenticatedUser | null = this.userService.getAuthenticatedUser();
        if (!currentUserInfo) {
            this.router.navigate([RoutesEnum.LOGIN]);
            return of(false);
        }

        return of(this.hasPermission(route, currentUserInfo));
    }

    hasPermission(route: ActivatedRouteSnapshot, currentUserInfo: AuthenticatedUser): boolean {
        const userGroups: string = currentUserInfo?.role;
        const requiredGroups = this.getRolesFromRoute(route);
        const hasPermission = requiredGroups.some((reqGroup: string) => userGroups.includes(reqGroup));
        if (!hasPermission)
            this.router.navigate(['/profile']);
        return hasPermission;
    }

    getRolesFromRoute(route: ActivatedRouteSnapshot) {
        const rolesAttributeName = this.getGroupsAttributeName();
        return route.data[rolesAttributeName] || [];
    }

    getGroupsAttributeName(): string {
        return 'groups';
    }
}

export const roleGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    return inject(RoleGuard).canActivate(route, state);
};
