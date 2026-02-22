import { Column } from "../models/column.model";

export const PrenotazioneTableColumn: Column[] = [
    {
        title: 'Numero prenotazione',
        attributeName: 'numeroPrenotazione',
    },
    {
        title: 'Tipo visita',
        attributeName: 'tipoVisita',
    },
    {
        title: 'Stato',
        attributeName: 'stato',
    },
    {
        title: 'Paziente',
        attributeName: 'pazienteNomeCompleto',
    },
    {
        title: 'Tutore',
        attributeName: 'tutoreNomeCompleto',
    }, 
    {
        title: 'Medico',
        attributeName: 'medicoNomeCompleto',
    }
]