import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild, computed, effect } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { PazienteService } from '../../services/paziente.service';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CodiceFiscaleService } from '../../shared/services/codice-fiscale.service';
import { PrivacyContentDialogComponent } from '../privacy-content-dialog/privacy-content-dialog.component';
import { FormItem } from '../../shared/models/form-item.model';


@Component({
  selector: 'app-add-patient-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    GenericFormComponent
  ],
  templateUrl: './add-patient-dialog.component.html',
  styleUrl: './add-patient-dialog.component.scss'
})
export class AddPatientDialogComponent {

  @ViewChild('stepper') stepper!: MatStepper;

  private readonly dialogRef = inject(MatDialogRef<AddPatientDialogComponent>);
  private readonly pazienteService = inject(PazienteService);
  private readonly snackBar = inject(SnackbarService);
  private readonly codiceFiscaleService = inject(CodiceFiscaleService);
  private readonly dialog = inject(MatDialog);

  // Signal per i dati del form
  private formDataRaw = signal<any>({});
  formDataStep1 = signal<any>({});
  formDataStep2 = signal<any>({});
  isSaving = signal<boolean>(false);

  // Computed signal per il codice fiscale
  codiceFiscaleCalcolato = computed(() => {
    const data = this.formDataRaw();
    const { nome, cognome, dataNascita, sesso, citta, comuneNascita } = data;

    // Usa 'citta' se presente, altrimenti 'comuneNascita'
    const comune = citta || comuneNascita;

    // Verifica che tutti i campi necessari siano presenti
    if (!nome?.trim() || !cognome?.trim() || !dataNascita || !sesso || !comune?.trim()) {
      return '';
    }

    try {
      const cf = this.codiceFiscaleService.calcolaCodiceFiscale({
        nome: nome.trim(),
        cognome: cognome.trim(),
        dataNascita,
        sesso,
        comuneNascita: comune.trim()
      });
      
      return cf;
    } catch (error) {
      console.error('Errore nel calcolo del codice fiscale:', error);
      return '';
    }
  });

  isComuneNonTrovato = computed(() => {
    const cf = this.codiceFiscaleCalcolato();
    return cf.length > 0 && cf.includes('Z999');
  });

  step1Completed = computed(() => {
    const cf = this.codiceFiscaleCalcolato();
    const relazione = this.formDataRaw().relazione;
    return cf.length > 0 && relazione && relazione.trim().length > 0;
  });

  readonly anagraficiFields = FormConfigs.MINOR_INFO_FIELDS.filter(
    field => field.name !== 'codiceFiscale'
  );

  readonly sanitariFields = FormConfigs.PATIENT_INFO_FIELDS;

  readonly relazioneField: FormItem[] = [
    {
      name: 'relazione',
      label: 'Relazione con il minore',
      type: 'select',
      required: true,
      options: [
        { value: 'Padre', label: 'Padre' },
        { value: 'Madre', label: 'Madre' },
        { value: 'Tutore', label: 'Tutore Legale' },
        { value: 'Nonno', label: 'Nonno/a' },
        { value: 'Zio', label: 'Zio/a' },
        { value: 'Altro', label: 'Altro' }
      ]
    }
  ];

  onFormChange(data: any): void {
    this.formDataRaw.update(() => ({...data}));
  }
  
  onRelazioneChange(data: any): void {
    this.formDataRaw.update(current => ({...current, relazione: data.relazione}));
  }

  onFormChangeStep2(data: any): void {
    this.formDataStep2.set(data);
  }

  onNextStep(): void {
    const cf = this.codiceFiscaleCalcolato();
    
    if (!cf) {
      this.snackBar.openSnackBar('Impossibile calcolare il codice fiscale. Verifica i dati inseriti.', 'Chiudi');
      return;
    }

    this.formDataStep1.set({
      ...this.formDataRaw(),
      codiceFiscale: cf
    });

    this.stepper.next();
  }

  onSave(): void {
    const consentDialog = this.dialog.open(PrivacyContentDialogComponent, {
      width: '550px',
      disableClose: true,
      data: {
        minoreName: `${this.formDataStep1().nome} ${this.formDataStep1().cognome}`,
        codiceFiscale: this.codiceFiscaleCalcolato()
      }
    });

    consentDialog.afterClosed().subscribe((accepted: boolean) => {
      if (accepted) {
        this.savePatient();
      }
    });
  }

  private savePatient(): void {
    this.isSaving.set(true);

    // Combina i dati dei due step
    const payload = {
      ...this.formDataStep1(),
      ...this.formDataStep2(),
      consensoPrivacy: true,
      dataConsenso: new Date().toISOString()
    };

    this.pazienteService.createPaziente(payload).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Paziente aggiunto con successo', 'Chiudi');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Errore creazione paziente:', err);
        this.snackBar.openSnackBar('Errore nell\'aggiunta del paziente', 'Chiudi');
        this.isSaving.set(false);
      }
    });
  }

  onCancel(): void {
    const hasData = this.stepper?.selectedIndex > 0 || this.codiceFiscaleCalcolato();

    if (hasData) {
      if (confirm('Sei sicuro di voler annullare? I dati inseriti andranno persi.')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }

}