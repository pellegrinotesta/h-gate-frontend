import { Component, inject, signal } from '@angular/core';
import { Prenotazione } from '../../models/prenotazione.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ParametriVitali, RefertoCreate } from '../../models/referto.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { FormItem } from '../../shared/models/form-item.model';

export interface FormRefertoDialogData {
  prenotazione: Prenotazione;
}

export interface FormRefertoDialogResult {
  success: boolean;
  referto?: any;
}

@Component({
  selector: 'app-referto-dialog',
  imports: [
    SharedModule,
    GenericFormComponent,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './referto-dialog.component.html',
  styleUrl: './referto-dialog.component.scss'
})
export class RefertoDialogComponent {

  private dialogRef = inject(MatDialogRef<RefertoDialogComponent>);
  // private refertoService = inject(RefertoService);

  data = inject<FormRefertoDialogData>(MAT_DIALOG_DATA);

  get prenotazione(): Prenotazione | null {
    return this.data?.prenotazione ?? null;
  }

  isSaving = signal(false);

  formItems: FormItem[] = FormConfigs.FORM_REFERTO_FIELDS;

  salvaReferto(formData: any): void {
    const dto: RefertoCreate = {
      prenotazioneId: this.prenotazione!.id,
      titolo: formData.titolo,
      tipoReferto: formData.tipoReferto,
      anamnesi: formData.anamnesi || undefined,
      esameObiettivo: formData.esameObiettivo || undefined,
      diagnosi: formData.diagnosi,
      terapia: formData.terapia || undefined,
      prescrizioni: formData.prescrizioni || undefined,
      esamiRichiesti: formData.esamiRichiesti || undefined,
      noteMediche: formData.noteMediche || undefined,
      prossimoControllo: formData.prossimoControllo || undefined,
      parametriVitali: this.buildParametriVitali(formData) ?? undefined,
    };

    this.isSaving.set(true);

    // Decommentare quando RefertoService è disponibile:
    // this.refertoService.create(dto).subscribe({
    //   next: (res) => {
    //     this.dialogRef.close({ success: true, referto: res.data });
    //   },
    //   error: () => {
    //     this.isSaving.set(false);
    //   }
    // });

    console.log('DTO referto:', dto);
    this.isSaving.set(false);
    this.dialogRef.close({ success: true });
  }

  annulla(): void {
    this.dialogRef.close({ success: false });
  }

  private buildParametriVitali(v: any): ParametriVitali | null {
    const campi = ['pressioneSistolica', 'pressioneDiastolica', 'frequenzaCardiaca',
      'temperatura', 'peso', 'altezza', 'saturazione'];
    const hasValues = campi.some(c => v[c] !== null && v[c] !== '' && v[c] !== undefined);
    if (!hasValues) return null;
    return {
      pressioneSistolica: v.pressioneSistolica ?? undefined,
      pressioneDiastolica: v.pressioneDiastolica ?? undefined,
      frequenzaCardiaca: v.frequenzaCardiaca ?? undefined,
      temperatura: v.temperatura ?? undefined,
      peso: v.peso ?? undefined,
      altezza: v.altezza ?? undefined,
      saturazione: v.saturazione ?? undefined,
    };
  }
}
