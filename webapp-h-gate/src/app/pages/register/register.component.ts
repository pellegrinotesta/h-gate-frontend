import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { UserRole } from '../../shared/enums/user-role.enum';
import { Router } from '@angular/router';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegistrationService } from '../../services/registration.service';
import { CodiceFiscaleService } from '../../shared/services/codice-fiscale.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormItem } from '../../shared/models/form-item.model';
import { MatDialog } from '@angular/material/dialog';
import { PrivacyContentDialogComponent } from '../../components/privacy-content-dialog/privacy-content-dialog.component';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    GenericFormComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly dialog = inject(MatDialog);

  selectedRole = signal<UserRole | null>(null);
  currentStep = signal<number>(0);
  isLoading = signal<boolean>(false);

  // Dati raccolti
  tutoreGeneralData: any = null;
  minoreAnagraficiData: any = null;
  minoreClinici: any = null;
  medicoData: any = null;

  codiceFiscaleMinore = signal<string>('');

  private router = inject(Router);
  private registrationService = inject(RegistrationService);
  private codiceFiscaleService = inject(CodiceFiscaleService);
  private readonly snackBar = inject(SnackbarService);

  readonly UserRole = UserRole;

  // STEP 1 TUTORE: Dati generali (email, password, nome, cognome)
  readonly tutoreGeneralFields = FormConfigs.REGISTRATION_GENERAL_FIELDS;

  // STEP 2 TUTORE: Dati anagrafici minore (senza CF)
  readonly minoreAnagraficiFields: FormItem[] = [
    ...FormConfigs.MINOR_INFO_FIELDS.filter(f => f.name !== 'codiceFiscale'),
    {
      name: 'relazione',
      label: 'Relazione con il minore',
      type: 'select',
      required: true,
      colClass: 'col-12',
      options: [
        { value: 'Padre', label: 'Padre' },
        { value: 'Madre', label: 'Madre' },
        { value: 'Tutore', label: 'Tutore Legale' },
        { value: 'Nonno', label: 'Nonno/a' },
        { value: 'Zio', label: 'Zio/a' }
      ]
    }
  ];

  // STEP 3 TUTORE: Dati clinici minore
  readonly minoreClinicFields = FormConfigs.PATIENT_INFO_FIELDS;

  // MEDICO: Dati professionali
  readonly medicoFields = FormConfigs.DOCTOR_INFO_FIELDS;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const confirmControl = control.get('confirmPassword');
    if (confirmControl?.hasError('passwordMismatch')) {
      confirmControl.setErrors(null);
    }

    return null;
  }

  selectRole(role: UserRole) {
    this.selectedRole.set(role);
    this.currentStep.set(1);
  }

  // TUTORE - STEP 1: Salva dati generali
  onSaveTutoreGeneral(data: any): void {
    this.tutoreGeneralData = data;
    this.currentStep.set(2);
  }

  // TUTORE - STEP 2: Salva dati anagrafici minore
  onSaveMinoreAnagrafica(data: any): void {
    this.minoreAnagraficiData = {
      ...data,
      codiceFiscale: this.codiceFiscaleMinore()
    };
    this.currentStep.set(3);
  }

  // TUTORE - STEP 3: Salva dati clinici minore e completa
  onSaveMinoreClinici(data: any): void {
    this.minoreClinici = data;
    this.submitTutoreRegistration();
  }

  // MEDICO: Salva dati e completa
  onSaveMedico(data: any): void {
    this.medicoData = data;
    this.submitMedicoRegistration();
  }

  // Ascolta cambiamenti form minore per calcolare CF
  onMinoreAnagraficaChange(data: any): void {
    const { nome, cognome, dataNascita, sesso, citta, comuneNascita } = data;
    const comune = citta || comuneNascita;

    if (!nome?.trim() || !cognome?.trim() || !dataNascita || !sesso || !comune?.trim()) {
      this.codiceFiscaleMinore.set('');
      return;
    }

    try {
      const cf = this.codiceFiscaleService.calcolaCodiceFiscale({
        nome: nome.trim(),
        cognome: cognome.trim(),
        dataNascita,
        sesso,
        comuneNascita: comune.trim()
      });
      this.codiceFiscaleMinore.set(cf);
    } catch (error) {
      this.codiceFiscaleMinore.set('');
    }
  }

  submitTutoreRegistration(): void {
    this.isLoading.set(true);

    const payload = {
      ...this.tutoreGeneralData,
      ruolo: UserRole.TUTORE,
      minore: {
        ...this.minoreAnagraficiData,
        ...this.minoreClinici
      }
    };

    const consentDialog = this.dialog.open(PrivacyContentDialogComponent, {
      width: '550px',
      disableClose: true,
      data: {
        minoreName: `${payload.minore.nome} ${payload.minore.cognome}`,
        codiceFiscale: `${payload.minore.codiceFiscale}`
      }
    });

    consentDialog.afterClosed().subscribe((accepted: boolean) => {
      if (accepted) {
        this.savePatient(payload);
      }
    });


  }

  // MEDICO - STEP 1: Salva dati generali (come tutore)
  onSaveMedicoGeneral(data: any): void {
    this.tutoreGeneralData = data;
    this.currentStep.set(2);
  }

  submitMedicoRegistration(): void {
    this.isLoading.set(true);

    const payload = {
      ...this.tutoreGeneralData,
      ...this.medicoData,
      ruolo: UserRole.MEDICO
    };

    this.registrationService.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);

        const errorMessage = err?.error?.message || 'Email già in uso.';

        this.snackBar.openSnackBar(errorMessage, 'Chiudi');
      }
    });


  }

  private savePatient(payload: any): void {
    this.registrationService.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert('Errore durante la registrazione');
      }
    });
  }

  goBack(): void {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getRoleDescription(role: UserRole): string {
    return role === UserRole.TUTORE
      ? 'Gestisci le cartelle cliniche del minore e prenota visite mediche'
      : 'Gestisci i tuoi pazienti e la tua agenda professionale';
  }

}