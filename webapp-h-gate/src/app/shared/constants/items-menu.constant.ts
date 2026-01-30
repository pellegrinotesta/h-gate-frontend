import { RoutesEnum } from "../enums/routes.enum";
import { MenuSection } from "../models/menu-item.model";
import { ROLE_VISIBILITY } from "./role-visibility.constants";

export const ITEMS_MENU: MenuSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                icon: 'speed',
                link: RoutesEnum.DASHBOARD_PAZIENTE,
                permission: ROLE_VISIBILITY.DASHBOARD_PAZIENTE,
                tooltip: 'Dashboard Paziente'
            },
            {
                title: 'Dashboard',
                icon: 'speed',
                link: RoutesEnum.DASHBOARD_MEDICO,
                permission: ROLE_VISIBILITY.DASHBOARD_MEDICO,
                tooltip: 'Dashboard medico'
            },
            {
                title: 'Dashboard',
                icon: 'speed',
                link: RoutesEnum.DASHBOARD_AMMINISTRATORE,
                permission: ROLE_VISIBILITY.DASHBOARD_AMMINISTRATORE,
                tooltip: 'Dashboard amministratore'
            },
            {
                title: 'Prenotazioni',
                link: RoutesEnum.PRENOTAZIONI,
                permission: ROLE_VISIBILITY.PRENOTAZIONI_LIST,
                tooltip: 'Prenotazioni'
            },
            // {
            //     title: 'Calcolo graduatorie',
            //     link: RoutesEnum.CLASSIFICATIONS_MANAGEMENT,
            //     permission: ROLE_VISIBILITY.GRADUATORIE_MANAGEMENT,
            //     tooltip: 'Gestione e pubblicazione graduatorie bandi'
            // },
            // {
            //     title: 'Gestione Pagamenti',
            //     link: RoutesEnum.PAYMENTS_MANAGEMENT,
            //     permission: ROLE_VISIBILITY.PAYMENTS_MANAGEMENT,
            //     tooltip: 'Gestione pagamenti'
            // }
        ],
    }

]