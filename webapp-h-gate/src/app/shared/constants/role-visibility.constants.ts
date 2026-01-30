import { Group } from "../enums/groups.enum";

export const ROLE_VISIBILITY = {
  DASHBOARD_PAZIENTE: [
    Group.PAZIENTE
  ],
  DASHBOARD_MEDICO: [
    Group.MEDICO
  ],
  DASHBOARD_AMMINISTRATORE: [
    Group.ADMIN
  ],
  PRENOTAZIONI_LIST: [
    Group.TUTORE
 
  ]
}
