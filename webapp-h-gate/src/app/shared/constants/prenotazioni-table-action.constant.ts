import { PrenotazioneDettagliata } from "../../models/prenotazione-dettagliata.model";
import { TableAction } from "../models/table-action.model";
import { TableOperation } from "../models/table-operation.model";


export const PrenotazioniAction: TableAction[] = [
    {
        operation: TableOperation.VIEW,
        title: 'Dettaglio',
        icon: "assignment",
    },
    {
        operation: TableOperation.DELETE,
        title: 'Annulla',
        icon: 'event_busy',
        isDisabled: (element: PrenotazioneDettagliata) => element.stato === 'ANNULLATA'
    }
];