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

@Component({
  selector: 'app-dashboard-medico',
  imports: [SharedModule, LoaderComponent, MatCardModule, MatChipsModule, RouterModule],
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
    this.isLoading = false;
    this.dashboasrdService.dashboardMedico().subscribe({
      next: (res) => {
        this.appuntamentiOggi.set(res.data.appuntamentiOggi);
        this.refertiDaCompletare.set(res.data.refertiDaCOmpletare);
        this.rating = res.data.ratingMedio;
        this.numeroRecensioni.set(res.data.numeroRecensioni);
        this.numeroPazienti.set(res.data.pazientiTotali);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Errore caricamento dashboard', err);
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
