export interface StatisticheGenerali {
    prenotazioniPerGiorno: StatGiorno[];
    specializzazioniTop: StatSpecializzazione[];
}

interface StatGiorno {
    giorno: string;
    valore: number;
}

interface StatSpecializzazione {
    specializzazione: string;
    valore: number;
}