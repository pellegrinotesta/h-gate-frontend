
import { Referto } from "../../models/referto.model";
import { Column } from "../models/column.model";

export const RefertoTableColumn: Column[] = [
    {
        title: 'Tipo Referto',
        attributeName: 'tipoReferto',
    },
    {
        title: 'Titolo',
        attributeName: 'titolo',
    },
    {
        title: 'Diagnosi',
        attributeName: 'diagnosi',
    },

    {
        title: 'Data emissione',
        attributeName: 'dataEmissione',
        computeField: (item: Referto) => {
            if (!item.dataEmissione) return '—';
            return new Date(item.dataEmissione).toLocaleDateString('it-IT');
        }
    },

]