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
        title: 'Elimina',
        icon: "delete_forever",
    }
];