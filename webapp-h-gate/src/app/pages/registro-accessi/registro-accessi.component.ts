import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { AuditService } from '../../services/audit.service';
import { AuditRiga, AZIONI_LEGGIBILI, FiltriAudit, RISORSE_LEGGIBILI } from '../../models/privacy.model';
import { errorMessage } from '../../shared/utils/error-message';

/** Registro accessi ai dati clinici (amministratore, sola lettura). */
@Component({
  selector: 'app-registro-accessi',
  imports: [
    DatePipe, FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTooltipModule
  ],
  templateUrl: './registro-accessi.component.html',
  styleUrl: './registro-accessi.component.scss'
})
export class RegistroAccessiComponent extends BasePageComponent implements OnInit {
  private auditService = inject(AuditService);

  readonly azioni: Record<string, string> = AZIONI_LEGGIBILI;
  readonly risorse: Record<string, string> = RISORSE_LEGGIBILI;
  readonly elencoAzioni = Object.keys(AZIONI_LEGGIBILI);

  filtri: FiltriAudit = { email: '', codiceFiscale: '', azione: '', esito: '', da: '', a: '' };
  righe = signal<AuditRiga[]>([]);
  totale = signal(0);
  pagina = signal(0);
  dimensione = signal(50);
  caricamento = signal(false);

  override ngOnInit(): void {
    this.cerca();
  }

  cerca(pagina = 0): void {
    this.pagina.set(pagina);
    this.caricamento.set(true);
    this.auditService.cerca(this.filtri, pagina, this.dimensione())
      .pipe(finalize(() => this.caricamento.set(false)))
      .subscribe({
        next: res => {
          this.righe.set(res.data?.content ?? []);
          this.totale.set(res.data?.totalElements ?? 0);
        },
        error: err => this.snackBar.openSnackBar(errorMessage(err, 'Errore nel caricamento del registro'), 'Chiudi')
      });
  }

  azzera(): void {
    this.filtri = { email: '', codiceFiscale: '', azione: '', esito: '', da: '', a: '' };
    this.cerca();
  }

  cambiaPagina(e: PageEvent): void {
    this.dimensione.set(e.pageSize);
    this.cerca(e.pageIndex);
  }
}
