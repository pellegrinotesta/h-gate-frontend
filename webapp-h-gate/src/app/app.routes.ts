import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/enums/routes.enum';
import { HomepageComponent } from './components/homepage/homepage.component';
import { authGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { roleGuard } from './shared/guards/role.guard';

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
        ]
    },
    {
        path: RoutesEnum.LOGIN,
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: RoutesEnum.PROFILE
    }
];
