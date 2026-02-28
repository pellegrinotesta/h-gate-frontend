export const apiUrl = 'http://localhost:8080';

export const environment = {
  production: true,
  endpoints: {
    auth: `${apiUrl}/authentication`,
    password: `${apiUrl}/password/`,
    roles: `${apiUrl}/roles/`,
    profile: `${apiUrl}/profile`,
    user: `${apiUrl}/user`,
    medico: `${apiUrl}/medico`,
    registration: `${apiUrl}/registration`,
    paziente: `${apiUrl}/paziente`,
    dashboard: `${apiUrl}/dashboard`,
    tariffe: `${apiUrl}/tariffe`,
  },
  jwt: {
    encryptionKey: 'Qs23RBNF330ms00n',
    allowedDomain: [apiUrl, apiUrl.replace('http://', '')],
    refresh: {
      minutesBeforeTokenExpiration: 8
    }
  }
};