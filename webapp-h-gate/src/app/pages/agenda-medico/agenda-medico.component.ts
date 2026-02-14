import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { AgendaService } from '../../services/agenda.service';
import { AgendaMedico } from '../../models/agenda-medico.model';

type VistaCalendario = 'giorno' | 'settimana' | 'mese';

interface GiornoCalendario {
  data: Date;
  appuntamenti: AgendaMedico[];
  isOggi: boolean;
  isMeseCorrente: boolean;
}

@Component({
  selector: 'app-agenda-medico',
  imports: [
    SharedModule,
    LoaderComponent,
    MatCardModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule],
  templateUrl: './agenda-medico.component.html',
  styleUrl: './agenda-medico.component.scss'
})
export class AgendaMedicoComponent extends BasePageComponent {

  readonly agendaService = inject(AgendaService);

  // Controlli vista
  vistaCorrente = signal<VistaCalendario>('settimana');
  dataSelezionata = signal<Date>(new Date());

  // Dati
  tuttePrenotazioni = signal<AgendaMedico[]>([]);
  prenotazioniFiltrate = signal<AgendaMedico[]>([]);

  // Calendario
  giorniSettimana = signal<GiornoCalendario[]>([]);
  giorniMese = signal<GiornoCalendario[]>([]);

  // Filtri
  filtroTipoVisita = signal<string>('tutte');
  filtroStato = signal<string>('tutti');
  tipiVisita = signal<string[]>([]);
  stati = signal<string[]>([]);

  // Stats rapide
  totaleAppuntamenti = signal(0);
  appuntamentiOggi = signal(0);
  appuntamentiSettimana = signal(0);

  override ngOnInit(): void {
    this.loadPrenotazioni();
  }

  loadPrenotazioni(): void {
    this.isLoading = true;
    this.agendaService.getPrenotazioniMedico().subscribe({
      next: (res) => {
        this.tuttePrenotazioni.set(res.data);
        this.estraiTipiVisita();
        this.estraiStati();
        this.applicaFiltri();
        this.aggiornaVista();
        this.calcolaStats();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Errore caricamento agenda', err);
      }
    });
  }

  /**
   * Estrae i tipi di visita unici dalle prenotazioni
   */
  estraiTipiVisita(): void {
    const tipi = new Set<string>();
    this.tuttePrenotazioni().forEach(p => {
      if (p.tipoVisita) {
        tipi.add(p.tipoVisita);
      }
    });
    this.tipiVisita.set(Array.from(tipi));
  }

  /**
   * Estrae gli stati unici dalle prenotazioni
   */
  estraiStati(): void {
    const stati = new Set<string>();
    this.tuttePrenotazioni().forEach(p => {
      if (p.stato) {
        stati.add(p.stato);
      }
    });
    this.stati.set(Array.from(stati));
  }

  /**
   * Applica i filtri alle prenotazioni
   */
  applicaFiltri(): void {
    let filtrate = [...this.tuttePrenotazioni()];

    // Filtro per tipo visita
    if (this.filtroTipoVisita() !== 'tutte') {
      filtrate = filtrate.filter(p => p.tipoVisita === this.filtroTipoVisita());
    }

    // Filtro per stato
    if (this.filtroStato() !== 'tutti') {
      filtrate = filtrate.filter(p => p.stato === this.filtroStato());
    }

    // Ordina per data/ora inizio
    filtrate.sort((a, b) => new Date(a.inizio).getTime() - new Date(b.inizio).getTime());

    this.prenotazioniFiltrate.set(filtrate);
  }

  /**
   * Aggiorna la vista corrente (giorno/settimana/mese)
   */
  aggiornaVista(): void {
    switch (this.vistaCorrente()) {
      case 'settimana':
        this.generaVistaSettimana();
        break;
      case 'mese':
        this.generaVistaMese();
        break;
      case 'giorno':
        this.generaVistaGiorno();
        break;
    }
  }

  /**
   * Genera la vista settimanale
   */
  generaVistaSettimana(): void {
    const giorni: GiornoCalendario[] = [];
    const inizioSettimana = this.getInizioSettimana(this.dataSelezionata());
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const data = new Date(inizioSettimana);
      data.setDate(data.getDate() + i);

      giorni.push({
        data: data,
        appuntamenti: this.getAppuntamentiPerGiorno(data),
        isOggi: data.getTime() === oggi.getTime(),
        isMeseCorrente: true
      });
    }

    this.giorniSettimana.set(giorni);
  }

  /**
   * Genera la vista mensile
   */
  generaVistaMese(): void {
    const giorni: GiornoCalendario[] = [];
    const anno = this.dataSelezionata().getFullYear();
    const mese = this.dataSelezionata().getMonth();

    // Primo giorno del mese
    const primoGiorno = new Date(anno, mese, 1);
    const inizioCalendario = this.getInizioSettimana(primoGiorno);

    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    // 6 settimane (42 giorni) per coprire tutti i casi
    for (let i = 0; i < 42; i++) {
      const data = new Date(inizioCalendario);
      data.setDate(data.getDate() + i);

      giorni.push({
        data: data,
        appuntamenti: this.getAppuntamentiPerGiorno(data),
        isOggi: data.getTime() === oggi.getTime(),
        isMeseCorrente: data.getMonth() === mese
      });
    }

    this.giorniMese.set(giorni);
  }

  /**
   * Genera la vista giornaliera
   */
  generaVistaGiorno(): void {
    // La vista giornaliera mostra solo il giorno selezionato con dettagli orari
    this.generaVistaSettimana(); // Usa la stessa struttura ma mostra solo un giorno
  }

  /**
   * Ottiene l'inizio della settimana (lunedì)
   */
  getInizioSettimana(data: Date): Date {
    const d = new Date(data);
    const giorno = d.getDay();
    const diff = giorno === 0 ? -6 : 1 - giorno; // Lunedì come primo giorno
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Ottiene gli appuntamenti per un giorno specifico
   */
  getAppuntamentiPerGiorno(data: Date): AgendaMedico[] {
    const dataTarget = new Date(data);
    dataTarget.setHours(0, 0, 0, 0);

    return this.prenotazioniFiltrate().filter(p => {
      const dataApp = new Date(p.inizio);
      dataApp.setHours(0, 0, 0, 0);
      return dataApp.getTime() === dataTarget.getTime();
    });
  }

  /**
   * Calcola statistiche rapide
   */
  calcolaStats(): void {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const inizioSettimana = this.getInizioSettimana(oggi);
    const fineSettimana = new Date(inizioSettimana);
    fineSettimana.setDate(fineSettimana.getDate() + 7);

    this.totaleAppuntamenti.set(this.prenotazioniFiltrate().length);

    this.appuntamentiOggi.set(
      this.prenotazioniFiltrate().filter(p => {
        const dataApp = new Date(p.inizio);
        dataApp.setHours(0, 0, 0, 0);
        return dataApp.getTime() === oggi.getTime();
      }).length
    );

    this.appuntamentiSettimana.set(
      this.prenotazioniFiltrate().filter(p => {
        const dataApp = new Date(p.inizio);
        return dataApp >= inizioSettimana && dataApp < fineSettimana;
      }).length
    );
  }

  /**
   * Cambia vista
   */
  cambiaVista(vista: VistaCalendario): void {
    this.vistaCorrente.set(vista);
    this.aggiornaVista();
  }

  /**
   * Navigazione temporale
   */
  vaiOggi(): void {
    this.dataSelezionata.set(new Date());
    this.aggiornaVista();
  }

  precedente(): void {
    const data = new Date(this.dataSelezionata());
    switch (this.vistaCorrente()) {
      case 'giorno':
        data.setDate(data.getDate() - 1);
        break;
      case 'settimana':
        data.setDate(data.getDate() - 7);
        break;
      case 'mese':
        data.setMonth(data.getMonth() - 1);
        break;
    }
    this.dataSelezionata.set(data);
    this.aggiornaVista();
  }

  successivo(): void {
    const data = new Date(this.dataSelezionata());
    switch (this.vistaCorrente()) {
      case 'giorno':
        data.setDate(data.getDate() + 1);
        break;
      case 'settimana':
        data.setDate(data.getDate() + 7);
        break;
      case 'mese':
        data.setMonth(data.getMonth() + 1);
        break;
    }
    this.dataSelezionata.set(data);
    this.aggiornaVista();
  }

  /**
   * Gestione filtri
   */
  applicaFiltroTipoVisita(tipo: string): void {
    this.filtroTipoVisita.set(tipo);
    this.applicaFiltri();
    this.aggiornaVista();
    this.calcolaStats();
  }

  applicaFiltroStato(stato: string): void {
    this.filtroStato.set(stato);
    this.applicaFiltri();
    this.aggiornaVista();
    this.calcolaStats();
  }

  /**
   * Ottiene il titolo del periodo corrente
   */
  getTitoloPeriodo(): string {
    const data = this.dataSelezionata();
    switch (this.vistaCorrente()) {
      case 'giorno':
        return data.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      case 'settimana':
        const inizio = this.getInizioSettimana(data);
        const fine = new Date(inizio);
        fine.setDate(fine.getDate() + 6);
        return `${inizio.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - ${fine.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      case 'mese':
        return data.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    }
  }

  /**
   * Utility per ottenere classe colore per stato
   */
  getStatoClass(stato: string): string {
    const statoLower = stato.toLowerCase();
    if (statoLower.includes('conferm')) return 'chip-stato-confermato';
    if (statoLower.includes('attesa') || statoLower.includes('pending')) return 'chip-stato-pending';
    if (statoLower.includes('annull') || statoLower.includes('cancel')) return 'chip-stato-annullato';
    return '';
  }

  /**
   * Azioni sugli appuntamenti
   */
  apriDettaglioAppuntamento(appuntamento: AgendaMedico): void {
    // Navigare al dettaglio o aprire modal
    console.log('Apri dettaglio:', appuntamento);
  }

  apriCartellaClinica(pazienteId: number): void {
    // Navigare a cartella clinica
    this.router.navigate(['/pazienti', pazienteId]);
  }

  creaReferto(agendaId: number): void {
    // Navigare a creazione referto
    this.router.navigate(['/referti/nuovo'], { queryParams: { agendaId } });
  }
}