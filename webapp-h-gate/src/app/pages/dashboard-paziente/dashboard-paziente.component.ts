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
import { Prenotazione } from '../../models/prenotazione.model';
import { Referto } from '../../models/referto.model';

@Component({
  selector: 'app-dashboard-paziente',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    LoaderComponent
  ],
  templateUrl: './dashboard-paziente.component.html',
  styleUrl: './dashboard-paziente.component.scss'
})
export class DashboardPazienteComponent extends BasePageComponent {

  private dashboardService = inject(DashboardService)
  stats = signal<StatCard[]>([]);
  prossimiAppuntamenti = signal<Prenotazione[]>([]);
  ultimiReferti = signal<Referto[]>([]);

  override ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard() {
    this.stats.set([
      {
        title: 'Prossime Visite',
        value: 0,
        icon: 'event',
        color: 'primary',
        change: '+1 questa settimana',
        trend: 'up'
      },
      {
        title: 'Referti Disponibili',
        value: 0,
        icon: 'description',
        color: 'success',
        change: '+2 nuovi',
        trend: 'up'
      },
      {
        title: 'Medici Seguiti',
        value: 0,
        icon: 'local_hospital',
        color: 'warning',
        change: 'Attivi'
      },
      {
        title: 'Visite Totali',
        value: 0,
        icon: 'bar_chart',
        color: 'info',
        change: "Quest'anno"
      }
    ]);
  }

  getStatoClass(stato: string): string {
    const classes: Record<string, string> = {
      'CONFERMATA': 'chip-confermata',
      'IN_ATTESA': 'chip-attesa',
      'COMPLETATA': 'chip-completata'
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


  modificaPrenotazione(id: number) {

  }

  annullaPrenotazione(id: number) {

  }





}
