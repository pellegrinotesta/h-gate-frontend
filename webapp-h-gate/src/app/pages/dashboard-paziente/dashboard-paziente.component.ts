import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { DashboardService } from '../../services/dashboard.service';
import { StatCard } from '../../models/stat-card.model';
import { Referto } from '../../models/referto.model';
import { PrenotazioneDettagliata } from '../../models/prenotazione-dettagliata.model';
import { MatSelectModule } from '@angular/material/select';
import { PazienteService } from '../../services/paziente.service';
import { MatDialog } from '@angular/material/dialog';
import { Paziente } from '../../models/paziente.model';
import { AddPatientDialogComponent } from '../../components/add-patient-dialog/add-patient-dialog.component';
import { AnnullaPrenotazioneDialogComponent } from '../../components/annulla-prenotazione-dialog/annulla-prenotazione-dialog.component';
import { PrenotazioneService } from '../../services/prenotazione.service';

@Component({
  selector: 'app-dashboard-paziente',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    LoaderComponent
  ],
  templateUrl: './dashboard-paziente.component.html',
  styleUrl: './dashboard-paziente.component.scss'
})
export class DashboardPazienteComponent extends BasePageComponent {

  private dashboardService = inject(DashboardService);
  private pazienteService = inject(PazienteService);
  private dialog = inject(MatDialog);
  private prenotazioneService = inject(PrenotazioneService);

  // Lista di tutti i minori del tutore
  minori = signal<Paziente[]>([]);

  // Minore attualmente selezionato
  minoreSelezionato = signal<Paziente | null>(null);

  // Dati del minore selezionato
  stats = signal<StatCard[]>([]);
  prossimiAppuntamenti = signal<PrenotazioneDettagliata[]>([]);
  ultimiReferti = signal<Referto[]>([]);

  override ngOnInit(): void {
    this.loadMinori();
  }

  loadMinori(): void {
    this.isLoading = true;

    this.pazienteService.getPazientiByTutore().subscribe({
      next: (res) => {
        this.minori.set(res.data || []);

        // Seleziona automaticamente il primo minore se presente
        if (res.data && res.data.length > 0) {
          this.minoreSelezionato.set(res.data[0]);
          this.loadDashboardMinore(res.data[0].id);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Errore nel caricamento dei minori', 'Chiudi');
        console.error(err);
      }
    });
  }

  onMinoreChange(paziente: Paziente): void {
    this.minoreSelezionato.set(paziente);
    this.loadDashboardMinore(paziente.id);
  }

  loadDashboardMinore(pazienteId: number): void {
    this.isLoading = true;

    this.dashboardService.dashboardPaziente().subscribe({
      next: (res) => {
        this.prossimiAppuntamenti.set(res.data.prenotazioni || []);
        this.ultimiReferti.set(res.data.referti || []);

        this.stats.set([
          {
            title: 'Prossime Visite',
            value: res.data.prossimiAppuntamenti || 0,
            icon: 'event',
            color: 'primary',
            change: '+1 questa settimana',
            trend: 'up'
          },
          {
            title: 'Referti Disponibili',
            value: this.ultimiReferti().length || 0,
            icon: 'description',
            color: 'success',
            change: '+2 nuovi',
            trend: 'up'
          },
          /*  {
              title: 'Medici Seguiti',
              value: res.data.mediciSeguiti || 0,
              icon: 'local_hospital',
              color: 'warning',
              change: 'Attivi'
            }, */
          {
            title: 'Visite Totali',
            value: res.data.visiteTotali || 0,
            icon: 'bar_chart',
            color: 'info',
            change: "Quest'anno"
          }
        ]);

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Errore nel recupero dei dati', 'Chiudi');
        console.error(err);
      }
    });
  }

  aggiungiMinore(): void {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Ricarica la lista dei minori
        this.loadMinori();
      }
    });
  }

  getStatoClass(stato: string): string {
    const classes: Record<string, string> = {
      'CONFERMATA': 'chip-confermata',
      'IN_ATTESA': 'chip-attesa',
      'COMPLETATA': 'chip-completata',
      'ANNULLATA': 'chip-annullata'
    };
    return classes[stato] || '';
  }

  getStatoLabel(stato: string): string {
    const labels: Record<string, string> = {
      'CONFERMATA': 'Confermata',
      'IN_ATTESA': 'In attesa',
      'COMPLETATA': 'Completata',
      'ANNULLATA': 'Annullata'
    };
    return labels[stato] || stato;
  }

  annullaPrenotazione(id: number): void {
    const ref = this.dialog.open(AnnullaPrenotazioneDialogComponent, {
      data: {
        prenotazioneId: id,
        pazienteNome: `${this.minoreSelezionato()?.nome} ${this.minoreSelezionato()?.cognome}`
      }
    });

    ref.afterClosed().subscribe(motivo => {
      if (!motivo) return;
      this.prenotazioneService.annullaPrenotazione(id, motivo).subscribe({
        next: () => {
          this.snackBar.openSnackBar('Prenotazione annullata', 'Chiudi');
          this.loadDashboardMinore(this.minoreSelezionato()!.id);
        },
        error: (err) => {
          this.snackBar.openSnackBar(
            err.error?.message ?? 'Errore durante l\'annullamento', 'Chiudi'
          );
        }
      });
    });

  }

  getEta(dataNascita: Date): number {
    const oggi = new Date();
    const nascita = new Date(dataNascita);
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const m = oggi.getMonth() - nascita.getMonth();
    if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) {
      eta--;
    }
    return eta;
  }

}
