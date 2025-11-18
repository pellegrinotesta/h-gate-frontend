import { RoutesEnum } from "../enums/routes.enum";
import { MenuSection } from "../models/menu-item.model";
import { ROLE_VISIBILITY } from "./role-visibility.constants";

export const ITEMS_MENU: MenuSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                icon: 'speed',
                link: RoutesEnum.STUDENT_DASHBOARD,
                permission: ROLE_VISIBILITY.DASHBOARD_STUDENT,
                tooltip: 'Dashboard studente'
            },
            {
                title: 'Graduatorie',
                icon: 'file_list',
                link: RoutesEnum.CLASSIFICATIONS_LIST,
                permission: ROLE_VISIBILITY.DASHBOARD_STUDENT,
                tooltip: 'Graduatorie'
            },
            {
                title: 'Pagamenti',
                icon: 'file_list',
                link: RoutesEnum.PAYMENTS,
                permission: ROLE_VISIBILITY.DASHBOARD_STUDENT,
                tooltip: 'Gestione pagamenti studente'
            },
            {
                title: 'Dashboard',
                icon: 'speed',
                link: RoutesEnum.OPERATOR_DASHBOARD,
                permission: ROLE_VISIBILITY.DASHBOARD_OPERATOR,
                tooltip: 'Dashboard operatore'
            },
            {
                title: 'Gestione domande',
                link: RoutesEnum.APPLICATION_MANAGEMENT,
                permission: ROLE_VISIBILITY.DASHBOARD_OPERATOR,
                tooltip: 'Gestione domande'
            },
            {
                title: 'Calcolo graduatorie',
                link: RoutesEnum.CLASSIFICATIONS_MANAGEMENT,
                permission: ROLE_VISIBILITY.GRADUATORIE_MANAGEMENT,
                tooltip: 'Gestione e pubblicazione graduatorie bandi'
            },
            {
                title: 'Gestione Pagamenti',
                link: RoutesEnum.PAYMENTS_MANAGEMENT,
                permission: ROLE_VISIBILITY.PAYMENTS_MANAGEMENT,
                tooltip: 'Gestione pagamenti'
            }
        ],
    }

]