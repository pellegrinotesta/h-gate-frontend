import { Validators } from "@angular/forms";
import { FormItem } from "../models/form-item.model";

export class FormConfigs {

    static readonly GENERAL_INFO_FIELDS: FormItem[] = [
        {
            name: 'nome',
            label: 'Nome',
            type: 'text',
            validators: [Validators.required, Validators.minLength(2)],
            colClass: 'col-md-6'
        },
        {
            name: 'cognome',
            label: 'Cognome',
            type: 'text',
            validators: [Validators.required, Validators.minLength(2)],
            colClass: 'col-md-6'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            validators: [Validators.required, Validators.email],
            colClass: 'col-md-6'
        },
        {
            name: 'telefono',
            label: 'Telefono',
            type: 'tel',
            validators: [Validators.pattern(/^\+?[0-9]{10,15}$/)],
            colClass: 'col-md-6'
        },
        {
            name: 'dataNascita',
            label: 'Data di nascita',
            type: 'date',
            colClass: 'col-md-6'
        },
        {
            name: 'indirizzo',
            label: 'Indirizzo',
            type: 'text',
            colClass: 'col-md-6'
        },
        {
            name: 'citta',
            label: 'Città',
            type: 'text',
            colClass: 'col-md-4'
        },
        {
            name: 'provincia',
            label: 'Provincia',
            type: 'text',
            validators: [Validators.maxLength(2)],
            colClass: 'col-md-4'
        },
        {
            name: 'cap',
            label: 'CAP',
            type: 'text',
            validators: [Validators.pattern(/^[0-9]{5}$/)],
            colClass: 'col-md-4'
        }
    ];

    static readonly REGISTRATION_GENERAL_FIELDS: FormItem[] = [
        {
            name: 'nome',
            label: 'Nome',
            type: 'text',
            validators: [Validators.required, Validators.minLength(2)],
            colClass: 'col-md-6'
        },
        {
            name: 'cognome',
            label: 'Cognome',
            type: 'text',
            validators: [Validators.required, Validators.minLength(2)],
            colClass: 'col-md-6'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            validators: [Validators.required, Validators.email],
            colClass: 'col-md-6'
        },
        {
            name: 'telefono',
            label: 'Telefono',
            type: 'tel',
            validators: [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)],
            colClass: 'col-md-6'
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            validators: [Validators.required, Validators.minLength(8)],
            colClass: 'col-md-6'
        },
        {
            name: 'confirmPassword',
            label: 'Conferma Password',
            type: 'password',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'dataNascita',
            label: 'Data di nascita',
            type: 'date',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'indirizzo',
            label: 'Indirizzo',
            type: 'text',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'citta',
            label: 'Città',
            type: 'text',
            validators: [Validators.required],
            colClass: 'col-md-4'
        },
        {
            name: 'provincia',
            label: 'Provincia',
            type: 'text',
            validators: [Validators.required, Validators.maxLength(2)],
            colClass: 'col-md-4'
        },
        {
            name: 'cap',
            label: 'CAP',
            type: 'text',
            validators: [Validators.required, Validators.pattern(/^[0-9]{5}$/)],
            colClass: 'col-md-4'
        }
    ];

    static readonly MINOR_INFO_FIELDS: FormItem[] = [
        {
            name: 'nome',
            label: 'Nome',
            type: 'text',
            validators: [Validators.required, Validators.minLength(2)],
            colClass: 'col-md-6'
        },
        {
            name: 'cognome',
            label: 'Cognome',
            type: 'text',
            validators: [Validators.required, Validators.minLength(2)],
            colClass: 'col-md-6'
        },
        {
            name: 'dataNascita',
            label: 'Data di nascita',
            type: 'date',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'codiceFiscale',
            label: 'Codice Fiscale',
            type: 'text',
            validators: [Validators.required, Validators.minLength(16), Validators.maxLength(16)],
            maxLength: 16,
            colClass: 'col-md-6'
        },
        {
            name: 'citta',
            label: 'Città',
            type: 'text',
            validators: [Validators.required],
            colClass: 'col-md-4'
        },
        {
            name: 'sesso',
            label: 'Sesso',
            type: 'select',
            options: [
                { value: 'M', label: 'Maschio' },
                { value: 'F', label: 'Femmina' }
            ],
            colClass: 'col-md-6'
        },

    ]

    static readonly PATIENT_INFO_FIELDS: FormItem[] = [

        {
            name: 'gruppoSanguigno',
            label: 'Gruppo sanguigno',
            type: 'select',
            options: [
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: '0+', label: '0+' },
                { value: '0-', label: '0-' }
            ],
            colClass: 'col-md-6'
        },
        {
            name: 'altezzaCm',
            label: 'Altezza (cm)',
            type: 'number',
            validators: [Validators.min(50), Validators.max(250)],
            min: 50,
            max: 250,
            colClass: 'col-md-6'
        },
        {
            name: 'pesoKg',
            label: 'Peso (kg)',
            type: 'number',
            validators: [Validators.min(2), Validators.max(300)],
            min: 2,
            max: 300,
            colClass: 'col-md-6'
        },
        {
            name: 'allergie',
            label: 'Allergie',
            type: 'textarea',
            rows: 3,
            colClass: 'col-12'
        },
        {
            name: 'patologieCroniche',
            label: 'Patologie croniche',
            type: 'textarea',
            rows: 3,
            colClass: 'col-12'
        },
        {
            name: 'noteMediche',
            label: 'Note mediche (es. condizioni croniche)',
            type: 'textarea',
            rows: 3,
            colClass: 'col-12'
        }
    ];

    static readonly DOCTOR_INFO_FIELDS: FormItem[] = [
        {
            name: 'specializzazione',
            label: 'Specializzazione',
            type: 'text',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'numeroAlbo',
            label: 'Numero Albo',
            type: 'text',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'universita',
            label: 'Università',
            type: 'text',
            colClass: 'col-md-6'
        },
        {
            name: 'annoLaurea',
            label: 'Anno Laurea',
            type: 'number',
            validators: [Validators.min(1950), Validators.max(new Date().getFullYear())],
            min: 1950,
            max: new Date().getFullYear(),
            colClass: 'col-md-6'
        },
        {
            name: 'bio',
            label: 'Biografia',
            type: 'textarea',
            validators: [Validators.maxLength(1000)],
            rows: 3,
            colClass: 'col-12'
        },
        {
            name: 'durataVisitaMinuti',
            label: 'Durata visita (min)',
            type: 'number',
            validators: [Validators.min(10), Validators.max(120)],
            min: 10,
            max: 120,
            colClass: 'col-md-6'
        }
    ];

    static readonly PASSWORD_CHANGE_FIELDS: FormItem[] = [
        {
            name: 'password',
            label: 'Password attuale',
            type: 'password',
            validators: [Validators.required],
            colClass: 'col-md-6'
        },
        {
            name: 'newPassword',
            label: 'Nuova password',
            type: 'password',
            validators: [Validators.required, Validators.minLength(8)],
            colClass: 'col-md-6'
        },
        {
            name: 'confirmPassword',
            label: 'Conferma password',
            type: 'password',
            validators: [Validators.required],
            colClass: 'col-md-6'
        }
    ]

    static readonly DETTAGLIO_PRENOTAZIONE_FIELDS: FormItem[] = [
        { name: 'numeroPrenotazione', label: 'Numero prenotazione', type: 'text', initialValue: '', colClass: 'col-md-3', readonly: true },
        { name: 'pazienteNomeCompleto', label: 'Paziente', type: 'text', initialValue: '', colClass: 'col-md-3', readonly: true },
        { name: 'tutoreNomeCompleto', label: 'Tutore', type: 'text', initialValue: '', colClass: 'col-md-3', readonly: true },
        { name: 'medicoNomeCompleto', label: 'Medico', type: 'text', initialValue: '', colClass: 'col-md-3', readonly: true },
        { name: 'dataOra', label: 'Data e ora', type: 'text', initialValue: '', colClass: 'col-md-4', readonly: true },
        { name: 'dataOraFine', label: 'Data e ora fine', type: 'text', initialValue: '', colClass: 'col-md-4', readonly: true },
        { name: 'tipoVisita', label: 'Tipo visita', type: 'text', initialValue: '', colClass: 'col-md-4', readonly: true },
        { name: 'stato', label: 'Stato prenotazione', type: 'text', initialValue: '', colClass: 'col-md-4', readonly: true },
        { name: 'costo', label: 'Costo', type: 'number', initialValue: 0, colClass: 'col-md-2', readonly: true },
        { name: 'notePaziente', label: 'Note paziente', type: 'textarea', initialValue: '', rows: 3, colClass: 'col-md-5', readonly: true },
        { name: 'noteMedico', label: 'Note medico', type: 'textarea', initialValue: '', rows: 3, colClass: 'col-md-5' },
        { name: 'motivoAnnullamento', label: 'Motivo cancellazione', type: 'textarea', initialValue: '', rows: 3, colClass: 'col-md-5', condition: (data) => data?.stato === 'ANNULLATA' || data?.stato === 'NON_PRESENTATO' },
        { name: 'dataAnnullamento', label: 'Data cancellazione', type: 'text', initialValue: '', colClass: 'col-md-3', readonly: true, condition: (data) => data?.stato === 'ANNULLATA' || data?.stato === 'NON_PRESENTATO' },
        { name: 'cancellatoDa', label: 'Cancellato da', type: 'text', initialValue: '', colClass: 'col-md-3', readonly: true, condition: (data) => data?.stato === 'ANNULLATA' || data?.stato === 'NON_PRESENTATO' },
        { name: 'promemoriaInviato', label: 'Promemoria inviato', type: 'checkbox', initialValue: false, colClass: 'col-md-2', readonly: true },
        { name: 'confermaInviata', label: 'Conferma prenotazione', type: 'checkbox', initialValue: false, colClass: 'col-md-2' },
        { name: 'isPrimaVisita', label: 'Prima visita', type: 'checkbox', initialValue: false, colClass: 'col-md-2', readonly: true },
        { name: 'isUrgente', label: 'Visita urgente', type: 'checkbox', initialValue: false, colClass: 'col-md-2', readonly: true }

    ]

    static readonly FORM_REFERTO_FIELDS: FormItem[] = [

        // Sezione 1
        { name: '_s1', label: 'Informazioni generali', type: 'section-header', placeholder: 'info_outline', colClass: 'col-12' },
        { name: 'titolo', label: 'Titolo referto', type: 'text', validators: [Validators.required], colClass: 'col-md-8' },
        { name: 'tipoReferto', label: 'Tipo referto', type: 'text', validators: [Validators.required], colClass: 'col-md-4' },

        // Sezione 2
        { name: '_s2', label: 'Dati clinici', type: 'section-header', placeholder: 'biotech', colClass: 'col-12' },
        { name: 'anamnesi', label: 'Anamnesi', type: 'textarea', rows: 3, colClass: 'col-12' },
        { name: 'esameObiettivo', label: 'Esame obiettivo', type: 'textarea', rows: 3, colClass: 'col-12' },
        { name: 'diagnosi', label: 'Diagnosi', type: 'textarea', validators: [Validators.required], rows: 3, colClass: 'col-12' },

        // Sezione 3
        { name: '_s3', label: 'Terapia e prescrizioni', type: 'section-header', placeholder: 'medication', colClass: 'col-12' },
        { name: 'terapia', label: 'Terapia', type: 'textarea', rows: 3, colClass: 'col-12' },
        { name: 'prescrizioni', label: 'Prescrizioni', type: 'textarea', rows: 3, colClass: 'col-12' },
        { name: 'esamiRichiesti', label: 'Esami richiesti', type: 'textarea', rows: 3, colClass: 'col-12' },

        // Sezione 4
        { name: '_s4', label: 'Parametri vitali', type: 'section-header', placeholder: 'monitor_heart', initialValue: 'opzionali', colClass: 'col-12' },
        { name: 'pressioneSistolica', label: 'Pressione sistolica (mmHg)', type: 'number', colClass: 'col-6 col-md-4' },
        { name: 'pressioneDiastolica', label: 'Pressione diastolica (mmHg)', type: 'number', colClass: 'col-6 col-md-4' },
        { name: 'frequenzaCardiaca', label: 'Freq. cardiaca (bpm)', type: 'number', colClass: 'col-6 col-md-4' },
        { name: 'temperatura', label: 'Temperatura (°C)', type: 'number', colClass: 'col-6 col-md-3' },
        { name: 'saturazione', label: 'Saturazione O₂ (%)', type: 'number', colClass: 'col-6 col-md-3' },
        { name: 'peso', label: 'Peso (kg)', type: 'number', colClass: 'col-6 col-md-3' },
        { name: 'altezza', label: 'Altezza (cm)', type: 'number', colClass: 'col-6 col-md-3' },

        // Sezione 5
        { name: '_s5', label: 'Note e follow-up', type: 'section-header', placeholder: 'event_repeat', colClass: 'col-12' },
        { name: 'noteMediche', label: 'Note mediche', type: 'textarea', rows: 3, colClass: 'col-md-8' },
        { name: 'prossimoControllo', label: 'Prossimo controllo', type: 'date', colClass: 'col-md-4' },
    ];

    static readonly FORM_ANAGRAFICA_PAZIENTE_FIELDS: FormItem[] = [
        // Sezione dati personali
        { name: 'section-dati', label: 'Dati anagrafici', type: 'section-header', placeholder: 'person', colClass: 'col-12' },
        { name: 'nome', label: 'Nome', type: 'text', colClass: 'col-md-4', readonly: true },
        { name: 'cognome', label: 'Cognome', type: 'text', colClass: 'col-md-4', readonly: true },
        { name: 'codiceFiscale', label: 'Codice Fiscale', type: 'text', colClass: 'col-md-4', readonly: true },
        { name: 'sesso', label: 'Sesso', type: 'text', colClass: 'col-md-3', readonly: true },
        { name: 'dataNascita', label: 'Data di nascita', type: 'date', colClass: 'col-md-3', readonly: true },
        { name: 'citta', label: 'Città', type: 'text', colClass: 'col-md-3', readonly: true },
        { name: 'gruppoSanguigno', label: 'Gruppo sanguigno', type: 'text', colClass: 'col-md-3', readonly: true },

        // Sezione clinica
        { name: 'section-clinica', label: 'Dati clinici', type: 'section-header', placeholder: 'monitor_heart', initialValue: 'opzionale', colClass: 'col-12' },
        { name: 'altezzaCm', label: 'Altezza (cm)', type: 'number', colClass: 'col-md-3', readonly: true },
        { name: 'pesoKg', label: 'Peso (kg)', type: 'number', colClass: 'col-md-3', readonly: true },
        { name: 'allergie', label: 'Allergie', type: 'textarea', rows: 2, colClass: 'col-md-5', readonly: true },
        { name: 'patologieCroniche', label: 'Patologie croniche', type: 'textarea', rows: 2, colClass: 'col-md-6', readonly: true }
    ];

    static readonly FORM_VALUTAZIONE_PSICOLOGICA_FIELDS: FormItem[] = [
        { name: 'section-info', label: 'Informazioni test', type: 'section-header', placeholder: 'psychology' },
        { name: 'tipoTest', label: 'Tipo di test', type: 'text', colClass: 'col-md-6', readonly: true },
        { name: 'dataValutazione', label: 'Data valutazione', type: 'date', colClass: 'col-md-3', readonly: true },
        { name: 'section-risultati', label: 'Risultati', type: 'section-header', placeholder: 'analytics' },
        { name: 'interpretazione', label: 'Interpretazione', type: 'textarea', rows: 5, colClass: 'col-md-12', readonly: true },
    ];

    static readonly FORM_PERCORSO_TERAPEUTICO_FIELDS: FormItem[] = [
        { name: 'section-info', label: 'Informazioni percorso', type: 'section-header', placeholder: 'route' },
        { name: 'titolo', label: 'Titolo percorso', type: 'text', colClass: 'col-md-8', readonly: true },
        { name: 'stato', label: 'Stato', type: 'text', colClass: 'col-md-4', readonly: true },
        { name: 'dataInizio', label: 'Data inizio', type: 'date', colClass: 'col-md-3', readonly: true },
        { name: 'dataFinePrevista', label: 'Fine prevista', type: 'date', colClass: 'col-md-3', readonly: true },
        { name: 'numeroSeduteEffettuate', label: 'Sedute effettuate', type: 'number', colClass: 'col-md-3', readonly: true },
        { name: 'numeroSedutePreviste', label: 'Sedute previste', type: 'number', colClass: 'col-md-3', readonly: true },
        { name: 'section-obiettivi', label: 'Obiettivi', type: 'section-header', placeholder: 'flag', initialValue: 'opzionale' },
        { name: 'obiettivi', label: 'Obiettivi terapeutici', type: 'textarea', rows: 4, colClass: 'col-md-12', readonly: true },
    ];

    static readonly FORM_PERCORSO_CREATE_FIELDS: FormItem[] = [
        {
            name: 'section-info',
            label: 'Informazioni percorso',
            type: 'section-header',
            placeholder: 'route',
            colClass: 'col-12'
        },
        {
            name: 'titolo',
            label: 'Titolo percorso *',
            type: 'text',
            colClass: 'col-md-8',
            validators: [Validators.required]
        },
        {
            name: 'stato',
            label: 'Stato',
            type: 'select',
            colClass: 'col-md-4',
            options: [
                { label: 'Attivo', value: 'ATTIVO' },
                { label: 'Sospeso', value: 'SOSPESO' },
                { label: 'Concluso', value: 'CONCLUSO' },
            ],
            initialValue: 'ATTIVO'
        },
        {
            name: 'dataFinePrevista',
            label: 'Data fine prevista',
            type: 'date',
            colClass: 'col-md-4'
        },
        {
            name: 'numeroSedutePreviste',
            label: 'Sedute previste',
            type: 'number',
            colClass: 'col-md-4'
        },
        {
            name: 'numeroSeduteEffettuate',
            label: 'Sedute effettuate',
            type: 'number',
            colClass: 'col-md-4',
            initialValue: 0
        },
        {
            name: 'section-obiettivi',
            label: 'Obiettivi terapeutici',
            type: 'section-header',
            placeholder: 'flag',
            colClass: 'col-12',
            initialValue: 'opzionale'
        },
        {
            name: 'obiettivi',
            label: 'Descrivi gli obiettivi del percorso',
            type: 'textarea',
            rows: 5,
            colClass: 'col-12'
        },
    ];

    // ===== PERCORSO TERAPEUTICO - FORM SOLA LETTURA =====
    static readonly FORM_PERCORSO_READ_FIELDS: FormItem[] = [
        {
            name: 'section-info',
            label: 'Informazioni percorso',
            type: 'section-header',
            placeholder: 'route',
            colClass: 'col-12'
        },
        { name: 'titolo', label: 'Titolo', type: 'text', colClass: 'col-md-8', readonly: true },
        { name: 'stato', label: 'Stato', type: 'text', colClass: 'col-md-4', readonly: true },
        { name: 'dataInizio', label: 'Data inizio', type: 'date', colClass: 'col-md-4', readonly: true },
        { name: 'dataFinePrevista', label: 'Fine prevista', type: 'date', colClass: 'col-md-4', readonly: true },
        { name: 'numeroSedutePreviste', label: 'Sedute previste', type: 'number', colClass: 'col-md-2', readonly: true },
        { name: 'numeroSeduteEffettuate', label: 'Sedute effettuate', type: 'number', colClass: 'col-md-2', readonly: true },
        {
            name: 'section-obiettivi',
            label: 'Obiettivi terapeutici',
            type: 'section-header',
            placeholder: 'flag',
            colClass: 'col-12',
            initialValue: 'opzionale'
        },
        { name: 'obiettivi', label: 'Obiettivi', type: 'textarea', rows: 4, colClass: 'col-12', readonly: true },
    ];

    // ===== VALUTAZIONE PSICOLOGICA - FORM CREAZIONE/MODIFICA =====
    static readonly FORM_VALUTAZIONE_CREATE_FIELDS: FormItem[] = [
        {
            name: 'section-info',
            label: 'Informazioni test',
            type: 'section-header',
            placeholder: 'psychology',
            colClass: 'col-12'
        },
        {
            name: 'tipoTest',
            label: 'Tipo di test *',
            type: 'select',
            colClass: 'col-md-6',
            validators: [Validators.required],
            options: [
                { label: 'WISC-IV (Intelligenza)', value: 'WISC-IV' },
                { label: 'CARS-2 (Autismo)', value: 'CARS-2' },
                { label: 'ADHD Rating Scale', value: 'ADHD-RS' },
                { label: 'Conners 3 (ADHD)', value: 'CONNERS-3' },
                { label: 'LEITER-3 (Non verbale)', value: 'LEITER-3' },
                { label: 'GARS-3 (Autismo)', value: 'GARS-3' },
                { label: 'Vineland-3 (Adattivo)', value: 'VINELAND-3' },
                { label: 'Altro', value: 'ALTRO' },
            ]
        },
        {
            name: 'section-punteggi',
            label: 'Punteggi',
            type: 'section-header',
            placeholder: 'analytics',
            colClass: 'col-12',
            initialValue: 'opzionale'
        },
        {
            name: 'punteggi',
            label: 'Punteggi (formato JSON, es: {"QI totale": 95, "Memoria": 88})',
            type: 'textarea',
            rows: 3,
            colClass: 'col-12'
        },
        {
            name: 'section-interpretazione',
            label: 'Interpretazione clinica',
            type: 'section-header',
            placeholder: 'manage_search',
            colClass: 'col-12'
        },
        {
            name: 'interpretazione',
            label: 'Interpretazione e osservazioni cliniche *',
            type: 'textarea',
            rows: 6,
            colClass: 'col-12',
            validators: [Validators.required]
        },
    ];

    // ===== VALUTAZIONE PSICOLOGICA - FORM SOLA LETTURA =====
    static readonly FORM_VALUTAZIONE_READ_FIELDS: FormItem[] = [
        {
            name: 'section-info',
            label: 'Informazioni test',
            type: 'section-header',
            placeholder: 'psychology',
            colClass: 'col-12'
        },
        { name: 'tipoTest', label: 'Tipo di test', type: 'text', colClass: 'col-md-6', readonly: true },
        { name: 'dataValutazione', label: 'Data valutazione', type: 'date', colClass: 'col-md-3', readonly: true },
        {
            name: 'section-punteggi',
            label: 'Punteggi',
            type: 'section-header',
            placeholder: 'analytics',
            colClass: 'col-12',
            initialValue: 'opzionale'
        },
        { name: 'punteggi', label: 'Punteggi (JSON)', type: 'textarea', rows: 3, colClass: 'col-12', readonly: true },
        {
            name: 'section-interpretazione',
            label: 'Interpretazione clinica',
            type: 'section-header',
            placeholder: 'manage_search',
            colClass: 'col-12'
        },
        { name: 'interpretazione', label: 'Interpretazione', type: 'textarea', rows: 6, colClass: 'col-12', readonly: true },
    ];

}