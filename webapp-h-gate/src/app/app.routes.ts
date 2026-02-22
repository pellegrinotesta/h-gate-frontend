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
                path: RoutesEnum.DASHBOARD_TUTORE,
                canActivate: [roleGuard],
                data: { roles: ROLE_VISIBILITY.DASHBOARD_TUTORE },
                loadComponent: () => import('./pages/dashboard-paziente/dashboard-paziente.component').then(m => m.DashboardPazienteComponent)

            },
            {
                path: RoutesEnum.DASHBOARD_MEDICO,
                canActivate: [roleGuard],
                data: { roles: ROLE_VISIBILITY.DASHBOARD_MEDICO },
                loadComponent: () => import('./pages/dashboard-medico/dashboard-medico.component').then(m => m.DashboardMedicoComponent)
            },
            {
                path: RoutesEnum.DASHBOARD_AMMINISTRATORE,
                canActivate: [roleGuard],
                data: { roles: ROLE_VISIBILITY.DASHBOARD_AMMINISTRATORE },
                loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
            },
            {
                path: RoutesEnum.PRENOTAZIONI,
                children: [
                    {
                        path: '',
                        canActivate: [roleGuard],
                        data: { roles: ROLE_VISIBILITY.PRENOTAZIONI_LIST },
                        loadComponent: () => import('./pages/prenotazioni-list/prenotazioni-list.component').then(m => m.PrenotazioniListComponent)
                    },
                    {

                        path: 'nuova',
                        canActivate: [roleGuard],
                        data: { roles: ROLE_VISIBILITY.PRENOTAZIONI_LIST },
                        loadComponent: () => import('./components/nuova-prenotazione/nuova-prenotazione.component').then(m => m.NuovaPrenotazioneComponent)

                    },
                    {
                        path: ':prenotazioneId',
                        canActivate: [roleGuard],
                        data: { roles: ROLE_VISIBILITY.PRENOTAZIONI_DETTAGLIO },
                        loadComponent: () => import('./pages/dettaglio-prenotazione/dettaglio-prenotazione.component').then(m => m.DettaglioPrenotazioneComponent)
                    }
                ]

            },
            {
                path: RoutesEnum.AGENDA,
                canActivate: [roleGuard],
                data: { roles: ROLE_VISIBILITY.AGENDA },
                loadComponent: () => import('./pages/agenda-medico/agenda-medico.component').then(m => m.AgendaMedicoComponent)
            },
            {
                path: RoutesEnum.REFERTO,
                children: [
                ]
                
            },
            {
                path: RoutesEnum.PAZIENTE,
                children: [
                    {
                        path: '',
                        canActivate: [roleGuard],
                        data: { roles: ROLE_VISIBILITY.PAZIENTI_LIST },
                        loadComponent: () => import('./pages/lista-pazienti/lista-pazienti.component').then(m => m.ListaPazientiComponent)
                    },
                    {
                        path: ':id',
                        canActivate: [roleGuard],
                        data: { roles: ROLE_VISIBILITY.CARTELLA_CLINICA },
                        loadComponent: () => import('./pages/cartella-clinica/cartella-clinica.component').then(m => m.CartellaClinicaComponent)
                    }
                ]
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
