import { Component, inject, input, signal } from '@angular/core';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { PercorsoTerapeuticoService } from '../../services/percorso-terapeutico.service';
import { PercorsoTerapeutico } from '../../models/percorso-terapeutico.model';
import { FormItem } from '../../shared/models/form-item.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { SNACKBAR } from '../../shared/enums/snackbar-class.enum';

@Component({
  selector: 'app-percorso-terapeutico',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericCardComponent,
    GenericFormComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './percorso-terapeutico.component.html',
  styleUrl: './percorso-terapeutico.component.scss'
})
export class PercorsoTerapeuticoComponent extends BasePageComponent {
  private route = inject(ActivatedRoute);
  private percorsoService = inject(PercorsoTerapeuticoService);

  // Può essere usato sia come pagina (/pazienti/:id/percorsi/nuovo)
  // sia come componente embedded con input
  pazienteId = input<number>();

  percorso = signal<PercorsoTerapeutico | null>(null);
  editMode = signal(false);
  isNew = signal(false);

  formFields = signal<FormItem[]>(FormConfigs.FORM_PERCORSO_READ_FIELDS);

  override ngOnInit(): void {
    const percorsoId = this.route.snapshot.paramMap.get('percorsoId');
    const pazId = this.pazienteId() ?? +(this.route.snapshot.paramMap.get('id') ?? 0);

    if (percorsoId && percorsoId !== 'nuovo') {
      this.loadPercorso(+percorsoId);
    } else {
      // Modalità creazione
      this.isNew.set(true);
      this.editMode.set(true);
      this.formFields.set(FormConfigs.FORM_PERCORSO_CREATE_FIELDS);
      this.percorso.set({ pazienteId: pazId } as any);
    }
  }

  loadPercorso(id: number): void {
    this.isLoading = true;
    this.percorsoService.get(id).subscribe({
      next: (res: any) => {
        this.percorso.set(res.data ?? res);
        this.formFields.set(FormConfigs.FORM_PERCORSO_READ_FIELDS);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.openSnackBar('Errore caricamento percorso', 'Chiudi', SNACKBAR.DANGER);
        this.isLoading = false;
      }
    });
  }

  abilitaModifica(): void {
    this.editMode.set(true);
    this.formFields.set(FormConfigs.FORM_PERCORSO_CREATE_FIELDS);
  }

  annullaModifica(): void {
    this.editMode.set(false);
    this.formFields.set(FormConfigs.FORM_PERCORSO_READ_FIELDS);
  }

  onSubmit(formValue: any): void {
    const pazienteId = this.percorso()?.pazienteId
      ?? this.pazienteId()
      ?? +(this.route.snapshot.paramMap.get('id') ?? 0);

    const dto = { ...formValue, pazienteId };

    if (this.isNew()) {
      this.percorsoService.crea(dto).subscribe({
        next: (res: any) => {
          this.snackBar.openSnackBar('Percorso creato con successo', 'Chiudi', SNACKBAR.SUCCESS);
          this.percorso.set(res.data ?? res);
          this.isNew.set(false);
          this.editMode.set(false);
          this.formFields.set(FormConfigs.FORM_PERCORSO_READ_FIELDS);
        },
        error: () => this.snackBar.openSnackBar('Errore durante il salvataggio', 'Chiudi', SNACKBAR.DANGER)
      });
    } else {
      this.percorsoService.aggiorna(this.percorso()!.id!, dto).subscribe({
        next: (res: any) => {
          this.snackBar.openSnackBar('Percorso aggiornato', 'Chiudi', SNACKBAR.SUCCESS);
          this.percorso.set(res.data ?? res);
          this.editMode.set(false);
          this.formFields.set(FormConfigs.FORM_PERCORSO_READ_FIELDS);
        },
        error: () => this.snackBar.openSnackBar('Errore durante l\'aggiornamento', 'Chiudi', SNACKBAR.DANGER)
      });
    }
  }

  elimina(): void {
    if (!confirm('Sei sicuro di voler eliminare questo percorso?')) return;
    this.percorsoService.elimina(this.percorso()!.id!).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Percorso eliminato', 'Chiudi', SNACKBAR.SUCCESS);
        this.location.back();
      },
      error: () => this.snackBar.openSnackBar('Errore durante l\'eliminazione', 'Chiudi', SNACKBAR.DANGER)
    });
  }

  getProgressoPercorso(): number {
    const p = this.percorso();
    if (!p?.numeroSedutePreviste || p.numeroSedutePreviste === 0) return 0;
    return Math.round(((p.numeroSeduteEffettuate ?? 0) / p.numeroSedutePreviste) * 100);
  }

  getStatoClass(stato: string): string {
    switch (stato) {
      case 'ATTIVO': return 'stato-attivo';
      case 'CONCLUSO': return 'stato-concluso';
      case 'SOSPESO': return 'stato-sospeso';
      default: return '';
    }
  }

  tornaIndietro(): void {
    this.location.back();
  }
}
