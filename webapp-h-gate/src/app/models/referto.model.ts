export interface Referto {
    id: number;
    titolo: string;
    dataEmissione: Date;
    tipoReferto: string;
    medico: {
        nome: string;
        cognome: string;
        specializzazione: string;
    };
    diagnosi: string;
    hasAllegati: boolean;
}