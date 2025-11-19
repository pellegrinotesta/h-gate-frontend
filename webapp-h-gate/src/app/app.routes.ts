import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/enums/routes.enum';
import { HomepageComponent } from './components/homepage/homepage.component';
import { authGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        canActivate: [authGuard],
        children: []
    },
    {
        path: RoutesEnum.LOGIN,
        component: LoginComponent
    }
];
