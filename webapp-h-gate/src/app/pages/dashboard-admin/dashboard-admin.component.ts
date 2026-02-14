import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService } from '../../services/dashboard.service';
import { MedicoDaVerificare, AttivitaRecente, PrenotazionePerGiorno, SpecializzazioneRichiesta } from '../../models/dashboard-admin-response.model';
import { KpiData } from '../../models/kpi-data.model';
import { StatCard } from '../../models/stat-card.model';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { LoaderComponent } from '../../components/loader/loader.component';


@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    LoaderComponent
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends BasePageComponent  implements OnInit {
  
  // Signals
 
  kpiData = signal<KpiData | null>(null);
  mediciDaVerificare = signal<MedicoDaVerificare[]>([]);
  recentActivity = signal<AttivitaRecente[]>([]);

  // Computed - Stats Cards
  stats = computed<StatCard[]>(() => {
    const kpi = this.kpiData();
    if (!kpi) return [];

    return [
      {
        title: 'Pazienti Totali',
        value: String(kpi.totalePazienti),
        icon: 'people',
        color: 'primary',
        change: `${kpi.pazientiInTerapia} in terapia`,
        trend: 'up'
      },
      {
        title: 'Medici Attivi',
        value: String(kpi.mediciAttivi),
        icon: 'local_hospital',
        color: 'success',
        change: `${kpi.mediciVerificati} verificati`
      },
      {
        title: 'Prenotazioni Oggi',
        value: String(kpi.prenotazioniOggi),
        icon: 'event',
        color: 'warning',
        change: `${kpi.prenotazioniOggiConfermate} confermate`,
        trend: kpi.trendPrenotazioniMese >= 0 ? 'up' : 'down'
      },
      {
        title: 'Da Confermare',
        value: String(kpi.prenotazioniDaConfermare),
        icon: 'pending_actions',
        color: 'info',
        change: `${kpi.prenotazioniProssimi7Giorni} prossimi 7gg`
      }
    ];
  });

  // Computed - Prenotazioni per giorno
  prenotazioniPerGiorno = computed<PrenotazionePerGiorno[]>(() => {
    const kpi = this.kpiData();
    if (!kpi) return [];

    const settimana = kpi.prenotazioniQuestaSettimana;
    return [
      { nome: 'Lunedì', valore: Math.floor(settimana / 7) },
      { nome: 'Martedì', valore: Math.floor(settimana / 6) },
      { nome: 'Mercoledì', valore: Math.floor(settimana / 5) },
      { nome: 'Giovedì', valore: Math.floor(settimana / 7) },
      { nome: 'Venerdì', valore: Math.floor(settimana / 6) },
      { nome: 'Sabato', valore: Math.floor(settimana / 10) },
      { nome: 'Domenica', valore: Math.floor(settimana / 15) }
    ];
  });

  maxPrenotazioni = computed(() => {
    const giorni = this.prenotazioniPerGiorno();
    return Math.max(...giorni.map(g => g.valore), 1);
  });

  // Computed - Specializzazioni top
  specializzazioniTop = computed<SpecializzazioneRichiesta[]>(() => {
    const kpi = this.kpiData();
    if (!kpi) return [];

    return [
      { nome: 'Neuropsichiatri', valore: kpi.neuropsichiatri },
      { nome: 'Psicologi', valore: kpi.psicologi },
      { nome: 'Logopedisti', valore: kpi.logopedisti }
    ].sort((a, b) => b.valore - a.valore);
  });

  maxSpecializzazioni = computed(() => {
    const specs = this.specializzazioniTop();
    return Math.max(...specs.map(s => s.valore), 1);
  });
readonly dashboardService = inject(DashboardService);

  override ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Carica tutti i dati della dashboard
   */
  private loadDashboardData(): void {
    this.isLoading = true;

    // Carica KPI - subscribe all'Observable
    this.dashboardService.getKpiData().subscribe({
      next: (response) => {
        this.kpiData.set(response.data);
      },
      error: (error) => {
        console.error('Errore caricamento KPI:', error);
        this.isLoading = false;
      }
    });

    // Carica medici da verificare - subscribe all'Observable
    this.dashboardService.getMediciDaVerificare().subscribe({
      next: (response) => {
        this.mediciDaVerificare.set(response.data);
      },
      error: (error) => {
        console.error('Errore caricamento medici:', error);
      }
    });

    // Carica dashboard completa - subscribe all'Observable
    this.dashboardService.getDashboardCompleta().subscribe({
      next: (response) => {
        this.recentActivity.set(response.data.attivitaRecenti || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore caricamento dashboard:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Visualizza documenti medico
   */
  viewDocuments(medicoId: number): void {
    console.log('Visualizza documenti medico:', medicoId);
    // TODO: Implementa navigazione o dialog
  }

  /**
   * Approva medico
   */
  async approvaMedico(medicoId: number): Promise<void> {
    if (!confirm('Confermi l\'approvazione di questo medico?')) {
      return;
    }

    try {
      await this.dashboardService.approvaMedico(medicoId);
      
      // Ricarica dati
      await this.loadDashboardData();
      
      // TODO: Mostra notifica successo
      console.log('Medico approvato con successo');
      
    } catch (error) {
      console.error('Errore approvazione medico:', error);
      // TODO: Mostra notifica errore
    }
  }

  /**
   * Rifiuta medico
   */
  async rifiutaMedico(medicoId: number): Promise<void> {
    const motivo = prompt('Inserisci il motivo del rifiuto:');
    if (!motivo) {
      return;
    }

    try {
      await this.dashboardService.rifiutaMedico(medicoId, motivo);
      
      // Ricarica dati
      await this.loadDashboardData();
      
      // TODO: Mostra notifica successo
      console.log('Medico rifiutato');
      
    } catch (error) {
      console.error('Errore rifiuto medico:', error);
      // TODO: Mostra notifica errore
    }
  }
}