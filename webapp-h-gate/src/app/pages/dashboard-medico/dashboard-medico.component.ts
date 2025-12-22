import { Component, inject, signal } from '@angular/core';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { DashboardService } from '../../services/dashboard.service';
import { StatCard } from '../../models/stat-card.model';
import { Prenotazione } from '../../models/prenotazione.model';
import { SharedModule } from '../../shared/shared.module';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard-medico',
  imports: [SharedModule, LoaderComponent, MatCardModule, MatChipsModule],
  templateUrl: './dashboard-medico.component.html',
  styleUrl: './dashboard-medico.component.scss'
})
export class DashboardMedicoComponent extends BasePageComponent {

  readonly dashboasrdService = inject(DashboardService);
  userName = '';
  oggi = new Date();
  stats = signal<StatCard[]>([]);
  appuntamentiOggi = signal<Prenotazione[]>([]);
  refertiDaCompletare = signal(0);
  rating = 0;
  numeroRecensioni = signal(0);
  numeroPazienti = signal(0);

  override ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.dashboasrdService.dashboardMedico().subscribe({
      next: (res) => {
        this.stats.set([
          {
            title: 'Visite Oggi',
            value: res.data.visiteOggi || 0,
            icon: 'today',
            color: 'primary',
            change: '8 programmate'
          },
          {
            title: 'Pazienti Totali',
            value: res.data.pazientiTotali || 0,
            icon: 'people',
            color: 'success',
            change: '+12 questo mese'
          },
          {
            title: 'Referti da Firmare',
            value: res.data.refertiDaFirmare || 0,
            icon: 'pending_actions',
            color: 'warning',
            change: 'In sospeso'
          },
          {
            title: 'Rating Medio',
            value: res.data.ratingMedio || '4.9',
            icon: 'star',
            color: 'info',
            change: `${res.data.numeroRecensioni || 0} recensioni`
          }
        ]);
        this.appuntamentiOggi.set(res.data.appuntamentiOggi || []);
        this.refertiDaCompletare.set(res.data.refertiDaFirmare || 0);
        this.rating = res.data.ratingMedio || 0;

        this.isLoading = false;
      }, error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar(err, 'error');
      }
    });
  }

  isProssimaVisita(app: Prenotazione): boolean {
    const now = new Date();
    const appTime = new Date(app.dataOra);
    const diff = appTime.getTime() - now.getTime();
    return diff > 0 && diff < 60 * 60 * 1000; // Prossima ora
  }

  iniziaVisita(id: number): void {
    // Implementare logica inizio visita
  }

  creaReferto(prenotazioneId: number): void {
    // Navigare a creazione referto
  }

  apriCartellaClinica(pazienteId: number): void {
    // Navigare a cartella clinica paziente
  }

}
