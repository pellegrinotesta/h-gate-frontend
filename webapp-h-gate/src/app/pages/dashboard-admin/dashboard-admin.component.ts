import { Component, inject, signal } from '@angular/core';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCard } from '../../models/stat-card.model';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-dashboard-admin',
  imports: [SharedModule, RouterLink, MatCardModule, MatChipsModule, MatTableModule, MatDialogModule, LoaderComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent extends BasePageComponent {

  readonly dashboardService = inject(DashboardService);
  private dialog = inject(MatDialog);

  stats = signal<StatCard[]>([]);
  mediciDaVerificare = signal<any[]>([]);
  prenotazioniPerGiorno = signal<any[]>([]);
  specializzazioniTop = signal<any[]>([]);
  maxPrenotazioni = signal(200);
  maxSpecializzazioni = signal(400);
  recentActivity = signal<any[]>([]);


  override ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.dashboardService.dashboardAdmin().subscribe({
      next: (res) => {
        this.stats.set([
          {
            title: 'Pazienti Attivi',
            value: res.data.pazientiAttivi || 0,
            icon: 'people',
            color: 'primary',
            change: '+12% questo mese',
            trend: 'up'
          },
          {
            title: 'Medici Attivi',
            value: res.data.mediciAttivi || 0,
            icon: 'local_hospital',
            color: 'success',
            change: '+3 questo mese',
            trend: 'up'
          },
          {
            title: 'Prenotazioni Oggi',
            value: res.data.prenotazioniOggi || 0,
            icon: 'event',
            color: 'warning',
            change: '-5% vs ieri',
            trend: 'down'
          },
          {
            title: 'Fatturato Mensile',
            value: `€${res.data.fatturatoMensile || 0}K`,
            icon: 'payments',
            color: 'info',
            change: '+18% vs scorso mese',
            trend: 'up'
          }
        ]);

        this.prenotazioniPerGiorno.set(res.data.statistiche.prenotazioniPerGiorno || []);
        this.specializzazioniTop.set(res.data.statistiche.specializzazioniTop || []);

        this.maxPrenotazioni.set(170);
        this.maxSpecializzazioni.set(400);

        // Mock attività recente
        this.recentActivity.set([
          { id: 1, action: 'Nuovo paziente registrato', icon: 'person_add', type: 'success', time: new Date() },
          { id: 2, action: 'Medico approvato', icon: 'verified', type: 'primary', time: new Date() },
          { id: 3, action: 'Prenotazione annullata', icon: 'event_busy', type: 'warning', time: new Date() },
          { id: 4, action: 'Referto caricato', icon: 'description', type: 'info', time: new Date() }
        ]);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('⚠️ Errore nel caricamento dei dati della dashboard', 'Chiudi');
        console.error('Errore nel caricamento della dashboard admin:', err);
      }
    })
  }

  viewDocuments(medicoId: number): void {
    // Implementare visualizzazione documenti
    console.log('View documents for medico:', medicoId);
  }

  approvaMedico(medicoId: number): void {
    // if (confirm('Sei sicuro di voler approvare questo medico?')) {
    //   this.dashboardService.approvaMedico(medicoId).subscribe({
    //     next: () => {
    //       this.snackBar.open('✓ Medico approvato con successo', 'Chiudi', { duration: 3000 });
    //       this.loadDashboardData();
    //     },
    //     error: () => {
    //       this.snackBar.open('⚠️ Errore durante l\'approvazione', 'Chiudi', { duration: 3000 });
    //     }
    //   });
    // }
  }

  rifiutaMedico(medicoId: number): void {
    // const motivo = prompt('Inserisci il motivo del rifiuto:');
    // if (motivo) {
    //   this.dashboardService.rifiutaMedico(medicoId, motivo).subscribe({
    //     next: () => {
    //       this.snackBar.open('✓ Medico rifiutato', 'Chiudi', { duration: 3000 });
    //       this.loadDashboard();
    //     },
    //     error: () => {
    //       this.snackBar.open('⚠️ Errore durante il rifiuto', 'Chiudi', { duration: 3000 });
    //     }
    //   });
    // }
  }

}
