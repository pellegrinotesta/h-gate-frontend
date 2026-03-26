import { Component, inject, signal } from '@angular/core';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { DashboardService } from '../../services/dashboard.service';
import { StatCard } from '../../models/stat-card.model';
import { Prenotazione } from '../../models/prenotazione.model';
import { SharedModule } from '../../shared/shared.module';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DisponibilitaMedicoComponent } from '../../components/disponibilita-medico/disponibilita-medico.component';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { RoutesEnum } from '../../shared/enums/routes.enum';
import { TariffeDialogComponent } from '../../components/tariffe-dialog/tariffe-dialog.component';
import { AnnullaPrenotazioneDialogComponent } from '../../components/annulla-prenotazione-dialog/annulla-prenotazione-dialog.component';

@Component({
  selector: 'app-dashboard-medico',
  imports: [SharedModule, LoaderComponent, MatCardModule, MatChipsModule, RouterModule],
  templateUrl: './dashboard-medico.component.html',
  styleUrl: './dashboard-medico.component.scss'
})
export class DashboardMedicoComponent extends BasePageComponent {

  readonly dashboasrdService = inject(DashboardService);
  readonly prenotazioneService = inject(PrenotazioneService);
  readonly dialog = inject(MatDialog);

  userName = '';
  oggi = new Date();
  stats = signal<StatCard[]>([]);
  tuttiAppuntamenti = signal<Prenotazione[]>([]);
  appuntamentiOggi = signal<Prenotazione[]>([]);
  appuntamentiFuturi = signal<Prenotazione[]>([]);

  refertiDaCompletare = signal(0);
  rating = 0;
  numeroRecensioni = signal(0);
  numeroPazienti = signal(0);
  mostraAppuntamentiFuturi = signal(false);
  appuntamentiFuturiPaginati = signal<Prenotazione[]>([]);
  giorniMostrati = signal(7);
  limiteMassimo = 20;

  override ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.dashboasrdService.dashboardMedico().subscribe({
      next: (res) => {
        this.userName = res.data.nomeMedico;
        this.tuttiAppuntamenti.set(res.data.appuntamentiOggi);
        this.filtraAppuntamenti();
        this.refertiDaCompletare.set(res.data.refertiDaCOmpletare);
        this.rating = res.data.ratingMedio;
        this.numeroRecensioni.set(res.data.numeroRecensioni);
        this.numeroPazienti.set(res.data.pazientiTotali);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Errore caricamento dashboard', err);
      }
    });
  }

  /**
   * Filtra gli appuntamenti dividendoli tra oggi e futuri
   */
  filtraAppuntamenti(): void {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const domani = new Date(oggi);
    domani.setDate(domani.getDate() + 1);

    const appOggi: Prenotazione[] = [];
    const appFuturi: Prenotazione[] = [];

    this.tuttiAppuntamenti().forEach(app => {
      const dataApp = new Date(app.dataOra);
      dataApp.setHours(0, 0, 0, 0);

      if (dataApp.getTime() === oggi.getTime()) {
        appOggi.push(app);
      } else if (dataApp >= domani) {
        appFuturi.push(app);
      }
    });

    // Ordina per data/ora
    appOggi.sort((a, b) => new Date(a.dataOra).getTime() - new Date(b.dataOra).getTime());
    appFuturi.sort((a, b) => new Date(a.dataOra).getTime() - new Date(b.dataOra).getTime());

    this.appuntamentiOggi.set(appOggi);
    this.appuntamentiFuturi.set(appFuturi);
    this.applicaPaginazione();
  }

  /**
   * Applica la paginazione agli appuntamenti futuri
   */
  applicaPaginazione(): void {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + this.giorniMostrati());

    const paginati = this.appuntamentiFuturi()
      .filter(app => {
        const dataApp = new Date(app.dataOra);
        return dataApp <= dataLimite;
      })
      .slice(0, this.limiteMassimo);

    this.appuntamentiFuturiPaginati.set(paginati);
  }

  /**
   * Determina se un appuntamento è la prossima visita (entro un'ora)
   */
  isProssimaVisita(app: Prenotazione): boolean {
    const now = new Date();
    const appTime = new Date(app.dataOra);
    const diff = appTime.getTime() - now.getTime();
    return diff > 0 && diff < 60 * 60 * 1000; // Prossima ora
  }

  /**
   * Toggle visualizzazione appuntamenti futuri
   */
  toggleAppuntamentiFuturi(): void {
    this.mostraAppuntamentiFuturi.set(!this.mostraAppuntamentiFuturi());
  }

  /**
   * Raggruppa appuntamenti futuri per giorno
   */
  raggruppaPerGiorno(): Map<string, Prenotazione[]> {
    const grouped = new Map<string, Prenotazione[]>();

    this.appuntamentiFuturiPaginati().forEach(app => {
      const data = new Date(app.dataOra);
      const chiave = data.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped.has(chiave)) {
        grouped.set(chiave, []);
      }
      grouped.get(chiave)!.push(app);
    });

    return grouped;
  }

  /**
   * Carica più appuntamenti futuri
   */
  caricaPiuAppuntamenti(): void {
    this.giorniMostrati.set(this.giorniMostrati() + 7);
    this.applicaPaginazione();
  }

  /**
   * Mostra meno appuntamenti futuri
   */
  mostraMenoAppuntamenti(): void {
    this.giorniMostrati.set(7);
    this.applicaPaginazione();
  }

  /**
   * Controlla se ci sono altri appuntamenti da mostrare
   */
  ciSonoAltriAppuntamenti(): boolean {
    return this.appuntamentiFuturi().length > this.appuntamentiFuturiPaginati().length;
  }

  gestisciDisponibilita() {
    const dialogRef = this.dialog.open(DisponibilitaMedicoComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.snackBar.openSnackBar('Disponibilità aggiornata con successo', 'Chiudi');
      }
    });
  }

  confermaAppuntamento(id: number): void {
    console.log('Conferma appuntamento ID:', id);
    this.prenotazioneService.confermaPrenotazione(id).subscribe({
      next: (res) => {
        if (res.ok) {
          this.snackBar.openSnackBar('Appuntamento confermato', 'Chiudi');
          this.loadDashboardData()
        } else {
          this.snackBar.openSnackBar('Errore conferma appuntamento', res.message);
        }
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore conferma appuntamento', err);
      }
    });
  }

  annullaAppuntamento(element: Prenotazione): void {
    const dialogRef = this.dialog.open(AnnullaPrenotazioneDialogComponent, {
      width: '500px',
      data: { prenotazioneId: element.id, pazienteNome: element.paziente?.nome }
    });

    dialogRef.afterClosed().subscribe((motivo: string | null) => {
      if (motivo) {
        this.prenotazioneService.annullaPrenotazione(element.id, motivo).subscribe({
          next: (res) => {
            if (res.ok === false) {
              this.snackBar.openSnackBar(res.message, 'Chiudi');
            } else {
              this.snackBar.openSnackBar('Operazione avvenuta con successo', 'Chiudi');
              this.loadDashboardData();
            }
          }
        });
      }
    });
  }

  apriGestioneTariffe(): void {
    this.dialog.open(TariffeDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: false,
    });
  }

  apriCartellaClinica(pazienteId: number | undefined): void {
    if (!pazienteId) {
      this.snackBar.openSnackBar('Paziente non disponibile', 'Chiudi');
      return;
    }
    this.router.navigate(['/referti', pazienteId]);
  }

  apriDettaglioPrenotazione(prenotazioneId: number): void {
    this.router.navigate([RoutesEnum.PRENOTAZIONI, prenotazioneId]);
  }

  mostraCalendarioCompleto() {
    this.router.navigate(['/agenda']);
  }
}