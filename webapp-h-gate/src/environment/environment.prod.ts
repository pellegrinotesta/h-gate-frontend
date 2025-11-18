export const apiUrl = 'http://localhost:8080/h-gate';

export const environment = {
  production: true,
  endpoints: {
    login: `${apiUrl}/login`,
    user: `${apiUrl}/users`,
    verify_otp: `${apiUrl}/verify-otp`,
    announcements: `${apiUrl}/announcements`,
    application: `${apiUrl}/application`,
    classification: `${apiUrl}/classification`,
    dashboard: `${apiUrl}/dashboard`,
    audit_log: `${apiUrl}/audit-logs`
  },
};