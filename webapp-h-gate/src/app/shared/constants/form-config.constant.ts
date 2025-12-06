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

    static readonly PATIENT_INFO_FIELDS: FormItem[] = [
        {
            name: 'codiceFiscale',
            label: 'Codice Fiscale',
            type: 'text',
            validators: [Validators.required, Validators.minLength(16), Validators.maxLength(16)],
            maxLength: 16,
            colClass: 'col-md-6'
        },
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
            label: 'Patologie Croniche',
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
            name: 'oldPassword',
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
}