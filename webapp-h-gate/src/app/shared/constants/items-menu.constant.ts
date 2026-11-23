import { RoutesEnum } from "../enums/routes.enum";
import { MenuSection } from "../models/menu-item.model";
import { ROLE_VISIBILITY } from "./role-visibility.constants";

export const ITEMS_MENU: MenuSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                icon: 'space_dashboard',
                link: RoutesEnum.DASHBOARD_TUTORE,
                permission: ROLE_VISIBILITY.DASHBOARD_TUTORE,
                tooltip: 'Dashboard Paziente'
            },
            {
                title: 'Dashboard',
                icon: 'space_dashboard',
                link: RoutesEnum.DASHBOARD_MEDICO,
                permission: ROLE_VISIBILITY.DASHBOARD_MEDICO,
                tooltip: 'Dashboard medico'
            },
            {
                title: 'Dashboard',
                icon: 'space_dashboard',
                link: RoutesEnum.DASHBOARD_AMMINISTRATORE,
                permission: ROLE_VISIBILITY.DASHBOARD_AMMINISTRATORE,
                tooltip: 'Dashboard amministratore'
            },
            {
                title: 'Prenotazioni',
                icon: 'event_available',
                link: RoutesEnum.PRENOTAZIONI,
                permission: ROLE_VISIBILITY.PRENOTAZIONI_LIST,
                tooltip: 'Prenotazioni'
            },
            {
                title: 'Agenda',
                icon: 'calendar_month',
                link: RoutesEnum.AGENDA,
                permission: ROLE_VISIBILITY.AGENDA,
                tooltip: 'Agenda'
            },
            {
                title: 'Approvazioni',
                icon: 'verified_user',
                link: RoutesEnum.APPROVAZIONI,
                permission: ROLE_VISIBILITY.APPROVAZIONI,
                tooltip: 'Approvazione specialisti e associazioni tutore-minore'
            },
            {
                title: 'Registro accessi',
                icon: 'manage_search',
                link: RoutesEnum.REGISTRO_ACCESSI,
                permission: ROLE_VISIBILITY.REGISTRO_ACCESSI,
                tooltip: 'Chi ha consultato o modificato i dati clinici'
            },
            {
                title: 'Privacy e consensi',
                icon: 'shield',
                link: RoutesEnum.PRIVACY,
                permission: ROLE_VISIBILITY.PRIVACY,
                tooltip: 'Consensi al trattamento dei dati e accessi ai dati dei minori'
            },
            {
                title: 'Pazienti',
                icon: 'groups',
                link: RoutesEnum.PAZIENTE,
                permission: ROLE_VISIBILITY.PAZIENTI_LIST,
                tooltip: 'Pazienti'
            }
        ],
    }

]