import { Group } from "../enums/groups.enum";

export const ROLE_VISIBILITY = {
  DASHBOARD_TUTORE: [
    Group.TUTORE
  ],
  DASHBOARD_MEDICO: [
    Group.MEDICO
  ],
  DASHBOARD_AMMINISTRATORE: [
    Group.ADMIN
  ],
  PRENOTAZIONI_LIST: [
    // Group.ADMIN,
    Group.TUTORE
  ],
  AGENDA: [
    Group.MEDICO
  ],
  PRENOTAZIONI_DETTAGLIO: [
    Group.TUTORE,
    Group.MEDICO,
    Group.ADMIN
  ],
  REFERTO: [
    Group.TUTORE,
    Group.MEDICO
  ],
  PAZIENTI_LIST: [
    // Group.ADMIN,
    Group.MEDICO
  ],
  CARTELLA_CLINICA: [
    Group.TUTORE,
    Group.MEDICO
  ]

}
