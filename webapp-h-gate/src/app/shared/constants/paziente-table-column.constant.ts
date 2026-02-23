import { Column } from "../models/column.model";

export const PazienteTableColumn: Column[] = [
    {
        title: 'Nome',
        attributeName: 'nome',
    },
    {
        title: 'Cognome',
        attributeName: 'cognome',
    },
    {
        title: 'Data di nascita',
        attributeName: 'dataNascita',
        computeField: (item: any) => {
            if (!item.dataNascita) return '—';
            return new Date(item.dataNascita).toLocaleDateString('it-IT');
        }
    },
    {
        title: 'Città',
        attributeName: 'citta',
    },
    {
        title: 'Codice fiscale',
        attributeName: 'codiceFiscale',
    },
    {
        title: 'Gruppo sanguigno',
        attributeName: 'gruppoSanguigno',
    }

]