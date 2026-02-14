import { Injectable } from '@angular/core';

interface CodiceFiscaleData {
  nome: string;
  cognome: string;
  dataNascita: Date | string;
  sesso: 'M' | 'F';
  comuneNascita: string;
}

@Injectable({
  providedIn: 'root'
})
export class CodiceFiscaleService {

  private readonly VOCALI = 'AEIOU';
  private readonly CONSONANTI = 'BCDFGHJKLMNPQRSTVWXYZ';
  
  // Mesi codificati
  private readonly MESI: { [key: number]: string } = {
    1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'H',
    7: 'L', 8: 'M', 9: 'P', 10: 'R', 11: 'S', 12: 'T'
  };

  // Caratteri dispari per il calcolo del check digit
  private readonly CHAR_DISPARI: { [key: string]: number } = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
  };

  // Caratteri pari per il calcolo del check digit
  private readonly CHAR_PARI: { [key: string]: number } = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
  };

  // Codici catastali comuni (esempio - in produzione usare database completo)
  private readonly CODICI_CATASTALI: { [key: string]: string } = {
    'ROMA': 'H501',
    'MILANO': 'F205',
    'NAPOLI': 'F839',
    'TORINO': 'L219',
    'PALERMO': 'G273',
    'GENOVA': 'D969',
    'BOLOGNA': 'A944',
    'FIRENZE': 'D612',
    'BARI': 'A662',
    'CATANIA': 'C351',
    'VENEZIA': 'L736',
    'VERONA': 'L781',
    'MESSINA': 'F158',
    'PADOVA': 'G224',
    'TRIESTE': 'L424',
    'BRESCIA': 'B157',
    'PARMA': 'G337',
    'PRATO': 'G999',
    'MODENA': 'F257',
    'REGGIO CALABRIA': 'H224',
    'REGGIO EMILIA': 'H223',
    'PERUGIA': 'G478',
    'LIVORNO': 'E625',
    'RAVENNA': 'H199',
    'CAGLIARI': 'B354',
    'FOGGIA': 'D643',
    'RIMINI': 'H294',
    'SALERNO': 'H703',
    'FERRARA': 'D548',
    'SASSARI': 'I452',
    'LATINA': 'E472',
    'GIUGLIANO IN CAMPANIA': 'E054',
    'MONZA': 'F704',
    'SIRACUSA': 'I754',
    'PESCARA': 'G482',
    'BERGAMO': 'A794',
    'TRENTO': 'L378',
    'FORLI': 'D704',
    'VICENZA': 'L840',
    'TERNI': 'L117',
    'BOLZANO': 'A952',
    'NOVARA': 'F952',
    'PIACENZA': 'G535',
    'ANCONA': 'A271',
    'ANDRIA': 'A285',
    'AREZZO': 'A390',
    'AVELLINO': 'A509',
    'UDINE': 'L483',
    'CESENA': 'C573',
    'LECCE': 'E506',
    'PESARO': 'G479',
    'BARLETTA': 'A669',
    'ALESSANDRIA': 'A182',
    'LA SPEZIA': 'E463',
    'PISA': 'G702',
    'GUIDONIA MONTECELIO': 'E263',
    'CATANZARO': 'C352',
    'PISTOIA': 'G713',
    'LUCCA': 'E715',
    'BRINDISI': 'B180',
    'COMO': 'C933',
    'TREVISO': 'L407',
    'BUSTO ARSIZIO': 'B300',
    'MARSALA': 'E974',
    'GROSSETO': 'E202',
    'VARESE': 'L682',
    'CASORIA': 'B990',
    'ASTI': 'A479',
    'GELA': 'D960',
    'POZZUOLI': 'G964',
    'CAPACCIO PAESTUM': 'B644'
  };

  /**
   * Calcola il codice fiscale italiano
   */
  calcolaCodiceFiscale(data: CodiceFiscaleData): string {
    try {
      const cognome = this.calcolaCognome(data.cognome);
      const nome = this.calcolaNome(data.nome);
      const dataNascita = this.calcolaDataNascita(data.dataNascita, data.sesso);
      const comune = this.getCodiceCatastale(data.comuneNascita);
      
      const parziale = cognome + nome + dataNascita + comune;
      const carattereControllo = this.calcolaCarattereControllo(parziale);
      
      return parziale + carattereControllo;
    } catch (error) {
      console.error('Errore nel calcolo del codice fiscale:', error);
      return '';
    }
  }

  /**
   * Estrae consonanti e vocali da una stringa
   */
  private estraiConsonantiEVocali(str: string): { consonanti: string; vocali: string } {
    const normalizzato = this.normalizza(str);
    const consonanti = normalizzato.split('').filter(c => this.CONSONANTI.includes(c)).join('');
    const vocali = normalizzato.split('').filter(c => this.VOCALI.includes(c)).join('');
    return { consonanti, vocali };
  }

  /**
   * Normalizza una stringa (uppercase, rimuove spazi e caratteri speciali)
   */
  private normalizza(str: string): string {
    return str
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
      .replace(/[^A-Z]/g, ''); // Mantiene solo lettere
  }

  /**
   * Calcola i 3 caratteri del cognome
   */
  private calcolaCognome(cognome: string): string {
    const { consonanti, vocali } = this.estraiConsonantiEVocali(cognome);
    let risultato = consonanti + vocali + 'XXX';
    return risultato.substring(0, 3);
  }

  /**
   * Calcola i 3 caratteri del nome
   */
  private calcolaNome(nome: string): string {
    const { consonanti, vocali } = this.estraiConsonantiEVocali(nome);
    
    // Se ci sono 4 o più consonanti, si prendono la 1a, 3a e 4a
    if (consonanti.length >= 4) {
      return consonanti[0] + consonanti[2] + consonanti[3];
    }
    
    let risultato = consonanti + vocali + 'XXX';
    return risultato.substring(0, 3);
  }

  /**
   * Calcola i 5 caratteri di data di nascita e sesso
   */
  private calcolaDataNascita(data: Date | string, sesso: 'M' | 'F'): string {
    const date = typeof data === 'string' ? new Date(data) : data;
    
    const anno = date.getFullYear().toString().substring(2);
    const mese = this.MESI[date.getMonth() + 1];
    let giorno = date.getDate();
    
    // Per le donne si aggiungono 40 al giorno
    if (sesso === 'F') {
      giorno += 40;
    }
    
    const giornoStr = giorno.toString().padStart(2, '0');
    
    return anno + mese + giornoStr;
  }

  /**
   * Ottiene il codice catastale del comune
   */
  private getCodiceCatastale(comune: string): string {
    const comuneNormalizzato = this.normalizza(comune);
    
    // Cerca nel dizionario
    const codice = this.CODICI_CATASTALI[comuneNormalizzato];
    
    if (codice) {
      return codice;
    }
    
    // Se non trovato, restituisce un placeholder (in produzione dovrebbe fare lookup su DB)
    console.warn(`Codice catastale non trovato per: ${comune}. Usando placeholder.`);
    return 'Z999'; // Placeholder
  }

  /**
   * Calcola il carattere di controllo (16° carattere)
   */
  private calcolaCarattereControllo(cf15: string): string {
    let somma = 0;
    
    for (let i = 0; i < 15; i++) {
      const char = cf15[i];
      if (i % 2 === 0) {
        // Posizione dispari (1, 3, 5, ...)
        somma += this.CHAR_DISPARI[char];
      } else {
        // Posizione pari (2, 4, 6, ...)
        somma += this.CHAR_PARI[char];
      }
    }
    
    const resto = somma % 26;
    return String.fromCharCode(65 + resto); // 65 = 'A'
  }

  /**
   * Valida un codice fiscale esistente
   */
  validaCodiceFiscale(cf: string): boolean {
    if (!cf || cf.length !== 16) {
      return false;
    }
    
    const cfUpper = cf.toUpperCase();
    const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
    
    if (!regex.test(cfUpper)) {
      return false;
    }
    
    // Verifica carattere di controllo
    const cf15 = cfUpper.substring(0, 15);
    const carattereCalcolato = this.calcolaCarattereControllo(cf15);
    
    return cfUpper[15] === carattereCalcolato;
  }

  /**
   * Ottiene la lista dei comuni disponibili
   */
  getComuniDisponibili(): string[] {
    return Object.keys(this.CODICI_CATASTALI).sort();
  }

  /**
   * Cerca comuni per nome parziale
   */
  cercaComuni(ricerca: string): string[] {
    const ricercaNormalizzata = this.normalizza(ricerca);
    return this.getComuniDisponibili().filter(comune => 
      this.normalizza(comune).includes(ricercaNormalizzata)
    );
  }
}