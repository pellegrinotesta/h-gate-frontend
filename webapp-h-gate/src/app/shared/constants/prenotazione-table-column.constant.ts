import { Column } from "../models/column.model";

export const PrenotazioneTableColumn: Column[] = [
    {
        title: 'Numero prenotazione',
        attributeName: 'numeroPrenotazione',
    },
    {
        title: 'Data e ora',
        attributeName: 'dataOra',
        pipeArgs: (value: string) => {
            if (!value) return '';
            const date = new Date(value);
            return date.toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    {
        title: 'Tipo visita',
        attributeName: 'tipoVisita',
    },
    {
        title: 'Stato',
        attributeName: 'stato',
        pipeArgs: (value: string) => value?.replace(/_/g, ' ')
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