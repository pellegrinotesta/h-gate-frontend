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
import { Subject, takeUntil } from 'rxjs';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

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
    LoaderComponent,
    BaseChartDirective
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent extends BasePageComponent implements OnInit {

  private destroy$ = new Subject<void>();

  // Signals
  kpiData = signal<KpiData | null>(null);
  recentActivity = signal<AttivitaRecente[]>([]);

  // ==================== CONFIGURAZIONE GRAFICI ====================

  // 1. GRAFICO PRENOTAZIONI PER GIORNO (Line Chart)
  prenotazioniLineChartData = computed<ChartData<'line'>>(() => {
    const giorni = this.prenotazioniPerGiorno();
    return {
      labels: giorni.map(g => g.nome),
      datasets: [
        {
          label: 'Prenotazioni',
          data: giorni.map(g => g.valore),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    };
  });

  prenotazioniLineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#8b5cf6',
        borderWidth: 2
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // 2. GRAFICO PAZIENTI PER ETÀ (Doughnut Chart)
  pazientiDoughnutChartData = computed<ChartData<'doughnut'>>(() => {
    const kpi = this.kpiData();
    if (!kpi) return { labels: [], datasets: [] };

    return {
      labels: ['0-5 anni', '6-12 anni', '13-18 anni'],
      datasets: [
        {
          data: [
            kpi.pazienti0_5Anni,
            kpi.pazienti6_12Anni,
            kpi.pazienti13_18Anni
          ],
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#10b981'
          ],
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 10
        }
      ]
    };
  });

  pazientiDoughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            //weight: '600'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // 3. GRAFICO SPECIALIZZAZIONI (Bar Chart Horizontale)
  specializzazioniBarChartData = computed<ChartData<'bar'>>(() => {
    const specs = this.specializzazioniTop();
    return {
      labels: specs.map(s => s.nome),
      datasets: [
        {
          label: 'Numero Medici',
          data: specs.map(s => s.valore),
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#10b981'
          ],
          borderRadius: 8,
          barThickness: 40
        }
      ]
    };
  });

  specializzazioniBarChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',  // Horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x} medici`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0'
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  // 4. GRAFICO PERCORSI TERAPEUTICI (Pie Chart)
  percorsiPieChartData = computed<ChartData<'pie'>>(() => {
    const kpi = this.kpiData();
    if (!kpi) return { labels: [], datasets: [] };

    return {
      labels: ['Attivi', 'In Valutazione', 'Sospesi'],
      datasets: [
        {
          data: [
            kpi.percorsiAttivi,
            kpi.percorsiInValutazione,
            kpi.percorsiSospesi
          ],
          backgroundColor: [
            '#10b981',
            '#f59e0b',
            '#ef4444'
          ],
          borderColor: '#fff',
          borderWidth: 3
        }
      ]
    };
  });

  percorsiPieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            //weight: '600'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // 5. GRAFICO STATUS PRENOTAZIONI (Doughnut Chart)
  statusPrenotazioniDoughnutData = computed<ChartData<'doughnut'>>(() => {
    const kpi = this.kpiData();
    if (!kpi) return { labels: [], datasets: [] };

    return {
      labels: ['Confermate', 'Completate', 'Da Confermare', 'Annullate'],
      datasets: [
        {
          data: [
            kpi.prenotazioniOggiConfermate,
            kpi.prenotazioniOggiCompletate,
            kpi.prenotazioniDaConfermare,
            kpi.prenotazioniAnnullateMese
          ],
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#ef4444'
          ],
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 10
        }
      ]
    };
  });

  // 6. GRAFICO MEDICI (Radar Chart)
  mediciRadarChartData = computed<ChartData<'radar'>>(() => {
    const kpi = this.kpiData();
    if (!kpi) return { labels: [], datasets: [] };

    return {
      labels: ['Attivi', 'Verificati', 'Disponibili', 'Neuropsichiatri', 'Psicologi', 'Logopedisti'],
      datasets: [
        {
          label: 'Medici',
          data: [
            kpi.mediciAttivi,
            kpi.mediciDisponibili,
            kpi.neuropsichiatri,
            kpi.psicologi,
            kpi.logopedisti
          ],
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#8b5cf6'
        }
      ]
    };
  });

  mediciRadarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0'
        },
        angleLines: {
          color: '#e2e8f0'
        },
        pointLabels: {
          font: {
            size: 11,
            //weight: '600'
          }
        }
      }
    }
  };

  // ==================== COMPUTED ORIGINALI ====================

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

  prenotazioniPerGiorno = computed<PrenotazionePerGiorno[]>(() => {
    const kpi = this.kpiData();
    if (!kpi) return [];

    const settimana = kpi.prenotazioniQuestaSettimana;
    return [
      { nome: 'Lun', valore: Math.floor(settimana / 7) },
      { nome: 'Mar', valore: Math.floor(settimana / 6) },
      { nome: 'Mer', valore: Math.floor(settimana / 5) },
      { nome: 'Gio', valore: Math.floor(settimana / 7) },
      { nome: 'Ven', valore: Math.floor(settimana / 6) },
      { nome: 'Sab', valore: Math.floor(settimana / 10) },
      { nome: 'Dom', valore: Math.floor(settimana / 15) }
    ];
  });

  maxPrenotazioni = computed(() => {
    const giorni = this.prenotazioniPerGiorno();
    return Math.max(...giorni.map(g => g.valore), 1);
  });

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

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.dashboardService.getKpiData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.kpiData.set(response.data);
        },
        error: (error) => {
          console.error('Errore caricamento KPI:', error);
          this.isLoading = false;
        }
      });

    this.dashboardService.getDashboardCompleta()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.recentActivity.set(response.data.attivitaRecenti || []);
          this.isLoading = false
        },
        error: (error) => {
          console.error('Errore caricamento dashboard:', error);
          this.isLoading = false
        }
      });
  }

  hasChartData(data: ChartData<any>): boolean {
    if (!data?.datasets?.length) return false;
    return data.datasets.some(ds =>
      ds.data?.some((v: any) => v !== null && v !== undefined && v > 0)
    );
  }

  viewDocuments(medicoId: number): void {
    console.log('Visualizza documenti medico:', medicoId);
  }

  approvaMedico(medicoId: number): void {
    if (!confirm('Confermi l\'approvazione di questo medico?')) {
      return;
    }

    // this.dashboardService.approvaMedico(medicoId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //       console.log('Medico approvato con successo');
    //       this.loadDashboardData();
    //     },
    //     error: (error) => {
    //       console.error('Errore approvazione medico:', error);
    //     }
    //   });
  }

  rifiutaMedico(medicoId: number): void {
    const motivo = prompt('Inserisci il motivo del rifiuto:');
    if (!motivo) {
      return;
    }

    // this.dashboardService.rifiutaMedico(medicoId, motivo)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //       console.log('Medico rifiutato');
    //       this.loadDashboardData();
    //     },
    //     error: (error) => {
    //       console.error('Errore rifiuto medico:', error);
    //     }
    //   });
  }
}