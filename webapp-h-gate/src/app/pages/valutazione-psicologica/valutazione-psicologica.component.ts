import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { SharedModule } from '../../shared/shared.module';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { ActivatedRoute } from '@angular/router';
import { ValutazionePsicologica } from '../../models/valutazione-psicologica.model';
import { ValutazionePsicologicaService } from '../../services/valutazione-psicologica.service';
import { SNACKBAR } from '../../shared/enums/snackbar-class.enum';
import { FormItem } from '../../shared/models/form-item.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';

@Component({
  selector: 'app-valutazione-psicologica',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericCardComponent,
    GenericFormComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './valutazione-psicologica.component.html',
  styleUrl: './valutazione-psicologica.component.scss'
})
export class ValutazionePsicologicaComponent extends BasePageComponent {

  private route = inject(ActivatedRoute);
  private valutazioneService = inject(ValutazionePsicologicaService);

  @ViewChild('genericForm') genericForm!: GenericFormComponent;

  pazienteId = input<number>();

  valutazione = signal<ValutazionePsicologica | null>(null);
  editMode = signal(false);
  isNew = signal(false);
  punteggiParsed = signal<Record<string, any> | null>(null);

  formFields = signal<FormItem[]>(FormConfigs.FORM_VALUTAZIONE_READ_FIELDS);

  override ngOnInit(): void {
    const valutazioneId = this.route.snapshot.paramMap.get('valutazioneId');
    const pazId = this.pazienteId() ?? +(this.route.snapshot.paramMap.get('id') ?? 0);

    if (valutazioneId && valutazioneId !== 'nuova') {
      this.loadValutazione(+valutazioneId);
    } else {
      this.isNew.set(true);
      this.editMode.set(true);
      this.formFields.set(FormConfigs.FORM_VALUTAZIONE_CREATE_FIELDS);
      this.valutazione.set({ pazienteId: pazId } as any);
    }
  }


  loadValutazione(id: number): void {
    this.isLoading = true;
    this.valutazioneService.get(id).subscribe({
      next: (res: any) => {
        const v = res.data ?? res;

        // Converti JSON punteggi → array per il GenericForm (type: 'array')
        if (v.punteggi) {
          try {
            const obj = JSON.parse(v.punteggi);
            v.punteggi = Object.entries(obj).map(([nome, valore]) => ({ nome, valore }));
          } catch {
            v.punteggi = [];
          }
        }

        this.valutazione.set(v);
        this.parsePunteggi(res.data?.punteggi ?? res.punteggi);
        this.formFields.set(FormConfigs.FORM_VALUTAZIONE_READ_FIELDS);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.openSnackBar('Errore caricamento valutazione', 'Chiudi', SNACKBAR.DANGER);
        this.isLoading = false;
      }
    });
  }

  private parsePunteggi(punteggiJson: string | any[] | null): void {
    if (!punteggiJson) { this.punteggiParsed.set(null); return; }

    // Se è già un array (dopo la conversione), converti in oggetto per il display
    if (Array.isArray(punteggiJson)) {
      const obj: Record<string, any> = {};
      punteggiJson.forEach((r: any) => { if (r.nome) obj[r.nome] = r.valore; });
      this.punteggiParsed.set(Object.keys(obj).length > 0 ? obj : null);
      return;
    }

    try {
      this.punteggiParsed.set(JSON.parse(punteggiJson));
    } catch {
      this.punteggiParsed.set(null);
    }
  }

  abilitaModifica(): void {
    this.editMode.set(true);
    this.formFields.set(FormConfigs.FORM_VALUTAZIONE_CREATE_FIELDS);
  }

  annullaModifica(): void {
    this.editMode.set(false);
    this.formFields.set(FormConfigs.FORM_VALUTAZIONE_READ_FIELDS);
  }

  submitForm(): void {
    if (!this.genericForm.isFormValid()) {
      this.genericForm['form'].markAllAsTouched();
      return;
    }
    this.onSubmit(this.genericForm.getFormValue());
  }

  onSubmit(formValue: any): void {
    const pazienteId = this.valutazione()?.pazienteId
      ?? this.pazienteId()
      ?? +(this.route.snapshot.paramMap.get('id') ?? 0);

    // Converti array righe → JSON
    const righe: any[] = formValue.punteggi ?? [];
    const punteggiObj: Record<string, any> = {};
    righe.forEach((r: any) => {
      if (r?.nome?.trim()) punteggiObj[r.nome.trim()] = r.valore;
    });
    const punteggi = Object.keys(punteggiObj).length > 0
      ? JSON.stringify(punteggiObj)
      : null;

    const dto = { ...formValue, pazienteId, punteggi };

    if (this.isNew()) {
      this.valutazioneService.crea(dto).subscribe({
        next: (res: any) => {
          const v = res.data ?? res;
          this.snackBar.openSnackBar('Valutazione creata con successo', 'Chiudi', SNACKBAR.SUCCESS);
          this.parsePunteggi(v.punteggi);
          // Converti per il display
          if (v.punteggi) {
            try {
              const obj = JSON.parse(v.punteggi);
              v.punteggi = Object.entries(obj).map(([nome, valore]) => ({ nome, valore }));
            } catch { v.punteggi = []; }
          }
          this.valutazione.set(v);
          this.isNew.set(false);
          this.editMode.set(false);
          this.formFields.set(FormConfigs.FORM_VALUTAZIONE_READ_FIELDS);
        },
        error: () => this.snackBar.openSnackBar('Errore durante il salvataggio', 'Chiudi', SNACKBAR.DANGER)
      });
    } else {
      this.valutazioneService.aggiorna(this.valutazione()!.id!, dto).subscribe({
        next: (res: any) => {
          const v = res.data ?? res;
          this.snackBar.openSnackBar('Valutazione aggiornata', 'Chiudi', SNACKBAR.SUCCESS);
          this.parsePunteggi(v.punteggi);
          if (v.punteggi) {
            try {
              const obj = JSON.parse(v.punteggi);
              v.punteggi = Object.entries(obj).map(([nome, valore]) => ({ nome, valore }));
            } catch { v.punteggi = []; }
          }
          this.valutazione.set(v);
          this.editMode.set(false);
          this.formFields.set(FormConfigs.FORM_VALUTAZIONE_READ_FIELDS);
        },
        error: () => this.snackBar.openSnackBar('Errore durante l\'aggiornamento', 'Chiudi', SNACKBAR.DANGER)
      });
    }
  }

  elimina(): void {
    if (!confirm('Sei sicuro di voler eliminare questa valutazione?')) return;
    this.valutazioneService.elimina(this.valutazione()!.id!).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Valutazione eliminata', 'Chiudi', SNACKBAR.SUCCESS);
        this.location.back();
      },
      error: () => this.snackBar.openSnackBar('Errore durante l\'eliminazione', 'Chiudi', SNACKBAR.DANGER)
    });
  }

  get punteggiEntries(): { key: string; value: any }[] {
    const p = this.punteggiParsed();
    if (!p) return [];
    return Object.entries(p).map(([key, value]) => ({ key, value }));
  }

  tornaIndietro(): void {
    this.location.back();
  }
}