import { Medico } from "../../models/medico.model";
import { Column } from "../models/column.model";

export const MedicoTableColumn: Column[] = [
    {
        title: 'Nome',
        attributeName: 'user.nome',
        computeField: (item: Medico) => item.user?.nome ?? '-'
    },
    {
        title: 'Cognome',
        attributeName: 'user.cognome',
        computeField: (item: Medico) => item.user?.cognome ?? '-'
    },
    {
        title: 'Specializzazione',
        attributeName: 'specializzazione',
    },
    {
        title: 'Numero Albo',
        attributeName: 'numeroAlbo',
    },
    {
        title: 'Città',
        attributeName: 'citta',
        computeField: (item: Medico) => item.user.citta ?? '-'
    },
    {
        title: 'Provincia',
        attributeName: 'provincia',
        computeField: (item: Medico) => item.user.provincia ?? '-'
    },
    {
        title: 'Telefono',
        attributeName: 'telefono',
        computeField: (item: Medico) => item.user.telefono ?? '-'
    },
    {
        title: 'Email',
        attributeName: 'email',
        computeField: (item: Medico) => item.user.email ?? '-'
    },
      {
        title: 'Data di nascita',
        attributeName: 'dataNascita',
        computeField: (item: Medico) => {
            if (!item.user.dataNascita) return '—';
            return new Date(item.user.dataNascita).toLocaleDateString('it-IT');
        }
    },

]