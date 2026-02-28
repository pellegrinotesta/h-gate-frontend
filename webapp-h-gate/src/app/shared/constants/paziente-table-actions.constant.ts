import { TableAction } from "../models/table-action.model";
import { TableOperation } from "../models/table-operation.model";


export const PazientiAction: TableAction[] = [
    {
        operation: TableOperation.VIEW,
        title: 'Cartella clinica',
        icon: "assignment",
    }
];