import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/enums/routes.enum';
import { HomepageComponent } from './components/homepage/homepage.component';
import { authGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { roleGuard } from './shared/guards/role.guard';
import { ROLE_VISIBILITY } from './shared/constants/role-visibility.constants';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        canActivate: [authGuard],
        children: [
            {
                path: RoutesEnum.PROFILE,
                loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: RoutesEnum.DASHBOARD_PAZIENTE,
                canActivate: [roleGuard],
                data: { roles: ROLE_VISIBILITY.DASHBOARD_PAZIENTE },
                loadComponent: () => import('./pages/dashboard-paziente/dashboard-paziente.component').then(m => m.DashboardPazienteComponent)

            },
            {
                path: RoutesEnum.DASHBOARD_MEDICO,
                canActivate: [roleGuard],
                data: {roles: ROLE_VISIBILITY.DASHBOARD_MEDICO },
                loadComponent: () => import('./pages/dashboard-medico/dashboard-medico.component').then(m => m.DashboardMedicoComponent)
            }

        ]
    },
    {
        path: RoutesEnum.LOGIN,
        component: LoginComponent
    },
    {
        path: RoutesEnum.REGISTER,
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '**',
        redirectTo: RoutesEnum.PROFILE
    }
];
