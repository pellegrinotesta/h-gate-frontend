import { Group } from "../enums/groups.enum";

export const ROLE_VISIBILITY = {
  DASHBOARD_OPERATOR: [
    Group.OPERATOR
  ],
  DASHBOARD_STUDENT: [
    Group.STUDENT
  ],
  GRADUATORIE_LIST: [
    Group.STUDENT, Group.OPERATOR
  ],
  GRADUATORIE_VIEW: [
    Group.STUDENT, Group.OPERATOR
  ],
  APPLICATION_FORM: [
    Group.STUDENT, Group.OPERATOR
  ],
  GRADUATORIE_MANAGEMENT: [
    Group.OPERATOR
  ],
  CONFIGURATION: [
    Group.OPERATOR
  ],
  PAYMENTS_MANAGEMENT: [
    Group.OPERATOR
  ],
  LOGS: [
    Group.OPERATOR
  ]
}
