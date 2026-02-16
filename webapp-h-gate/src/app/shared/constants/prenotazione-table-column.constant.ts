import { Column } from "../models/column.model";

export const PrenotazioneTableColumn: Column[] = [
    {
        title: 'numero prenotazione',
        attributeName: 'numeroPrenotazione',
    },
    {
        title: 'tipoVisita',
        attributeName: 'tipoVisita',
    },
    {
        title: 'stato',
        attributeName: 'stato',
    },
    {
        title: 'paziente',
        attributeName: 'pazienteNomeCompleto',
    },
    {
        title: 'tutore',
        attributeName: 'tutoreNomeCompleto',
    }, 
    {
        title: 'medico',
        attributeName: 'medicoNomeCompleto',
    }
]