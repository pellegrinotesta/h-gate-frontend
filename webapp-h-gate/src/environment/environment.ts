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
        prenotazione: `${apiUrl}/prenotazione`,
        agenda: `${apiUrl}/agenda`,
        notifiche: `${apiUrl}/notifiche`,
        disponibilita: `${apiUrl}/disponibilita/medico`,
        referto: `${apiUrl}/referto`,
        percorsoTerapeutico: `${apiUrl}/percorsi-terapeutici`,
        valutazioni: `${apiUrl}/valutazioni`,
        allegato: `${apiUrl}/allegati`,
        tariffe: `${apiUrl}/tariffe`,
        approvazioni: `${apiUrl}/admin/approvazioni`,
        consensi: `${apiUrl}/consensi`,
        audit: `${apiUrl}/admin/audit`
    },
    jwt: {
            allowedDomain: [apiUrl, apiUrl.replace('http://', '')],
        refresh: {
            minutesBeforeTokenExpiration: 8
        }
    }
};