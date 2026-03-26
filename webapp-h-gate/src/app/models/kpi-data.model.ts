export interface KpiData {
    // Pazienti
    totalePazienti: number;
    pazientiConsensoAttivo: number;
    pazientiInTerapia: number;
    pazienti0_5Anni: number;
    pazienti6_12Anni: number;
    pazienti13_18Anni: number;
    
    // Tutori
    totaleTutori: number;
    
    // Medici
    mediciDisponibili: number;
    mediciAttivi: number;
    neuropsichiatri: number;
    psicologi: number;
    logopedisti: number;
    
    // Prenotazioni
    prenotazioniOggi: number;
    prenotazioniOggiConfermate: number;
    prenotazioniOggiCompletate: number;
    prenotazioniProssimi7Giorni: number;
    prenotazioniQuestaSettimana: number;
    prenotazioniQuestoMese: number;
    prenotazioniCompletateMese: number;
    prenotazioniDaConfermare: number;
    prenotazioniAnnullateMese: number;
    
    // Percorsi Terapeutici
    percorsiAttivi: number;
    percorsiInValutazione: number;
    percorsiSospesi: number;
    
    // Referti
    refertiEmessiMese: number;
    refertiDaFirmare: number;
    refertiDaInviare: number;
    
    // Notifiche
    notificheNonLette: number;
    notificheOggi: number;
    
    // Metriche
    ratingMedioMedici: number;
    mediaSedutePerPercorso: number;
    trendPrenotazioniMese: number;
    
    ultimoAggiornamento: string;
  }