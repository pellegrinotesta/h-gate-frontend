export const apiUrl = 'http://localhost:8080/h-gate';

export const environment = {
    production: true,
    endpoints: {
        auth: `${apiUrl}/authentication`,
        password: `${apiUrl}/password/`,
        roles: `${apiUrl}/roles/`,
    },
    jwt: {
        encryptionKey: 'Qs23RBNF330ms00n',
        allowedDomain: [apiUrl, apiUrl.replace('http://', '')],
        refresh: {
            minutesBeforeTokenExpiration: 8
        }
    }
};