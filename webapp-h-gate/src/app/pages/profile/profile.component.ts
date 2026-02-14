import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { UserRole } from '../../shared/enums/user-role.enum';
import { MedicoService } from '../../services/medico.service';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { PazienteService } from '../../services/paziente.service';
import { Paziente } from '../../models/paziente.model';
import { AddPatientDialogComponent } from '../../components/add-patient-dialog/add-patient-dialog.component';


@Component({
  selector: 'app-profile',
  imports: [
    SharedModule,
    MatCardModule,
    LoaderComponent,
    GenericFormComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BasePageComponent {

  readonly profileService = inject(ProfileService);
  readonly medicoService = inject(MedicoService);
  readonly pazienteService = inject(PazienteService);
  readonly dialog = inject(MatDialog);

  // ====== DATI TUTORE (genitore loggato) ======
  user = signal<User | null>(null);
  editModeTutore = signal<boolean>(false);

  // ====== DATI PAZIENTI (bambini del tutore) ======
  pazienti = signal<Paziente[]>([]);
  selectedPaziente = signal<Paziente | null>(null);
  editModePaziente = signal<boolean>(false);

  // ====== DATI MEDICO (se ruolo medico) ======
  medicoId?: number;
  editModeMedico = signal<boolean>(false);

  // Tab attivo
  activeTab = signal<string>('general');

  // ====== FORM CONFIGS ======
  readonly generalInfoFields = FormConfigs.GENERAL_INFO_FIELDS;
  readonly patientInfoFields = FormConfigs.PATIENT_INFO_FIELDS;
  readonly doctorInfoFields = FormConfigs.DOCTOR_INFO_FIELDS;
  readonly passwordChangeFields = FormConfigs.PASSWORD_CHANGE_FIELDS;

  // Custom validator password
  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const group = control as FormGroup;
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  };

  // Computed properties
  isTutore = computed(() => this.user()?.roles.includes(UserRole.TUTORE) ?? false);
  isMedico = computed(() => this.user()?.roles.includes(UserRole.MEDICO) ?? false);
  isAmministratore = computed(() => this.user()?.roles.includes(UserRole.ADMIN) ?? false);

  fullName = computed(() => {
    const u = this.user();
    return u ? `${u.nome} ${u.cognome}` : '';
  });

  // ====== LIFECYCLE ======
  override ngOnInit(): void {
    this.loadProfile();
  }

  // ====== CARICAMENTO DATI ======

  loadProfile(): void {
    this.isLoading = true;

    this.profileService.get().subscribe({
      next: (user) => {
        this.user.set(user);

        if (Array.isArray(user.roles)) {
          if (user.roles.includes(UserRole.MEDICO)) {
            this.loadDetailsMedico();
          } else if (user.roles.includes(UserRole.TUTORE)) {
            this.loadPazienti();
          } else {
            this.isLoading = false;
          }
        }
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel caricamento del profilo', 'Chiudi');
        this.isLoading = false;
      }
    });
  }

  loadDetailsMedico(): void {
    this.medicoService.findMedicoByUserId().subscribe({
      next: (res) => {
        if (this.user()) {
          this.user.set({ ...this.user()!, ...res.data });
          this.medicoId = res.data.id;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore nel recupero delle informazioni medico', 'Chiudi');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadPazienti(): void {
    this.pazienteService.getPazientiByTutore().subscribe({
      next: (res) => {
        this.pazienti.set(res.data || []);
        
        if (this.pazienti().length > 0) {
          this.selectedPaziente.set(this.pazienti()[0]);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore nel recupero dei pazienti', 'Chiudi');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // ====== AZIONI TUTORE ======

  toggleEditModeTutore(): void {
    this.editModeTutore.update(v => !v);
  }

  saveGeneralInfoTutore(data: User): void {
    const payload = {
      ...data,
      id: this.user()?.id
    };

    this.profileService.updateGeneralInfo(payload).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Informazioni tutore salvate', 'Chiudi');
        this.editModeTutore.set(false);
        this.loadProfile();
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel salvataggio', 'Chiudi');
      }
    });
  }

  // ====== AZIONI PAZIENTE (bambino) ======

  selectPaziente(paziente: Paziente): void {
    this.selectedPaziente.set(paziente);
    this.editModePaziente.set(false);
  }

  toggleEditModePaziente(): void {
    this.editModePaziente.update(v => !v);
  }

  saveInfoPaziente(data: any): void {
    const pazienteId = this.selectedPaziente()?.id;
    
    if (!pazienteId) {
      this.snackBar.openSnackBar('Nessun paziente selezionato', 'Chiudi');
      return;
    }

    const payload = {
      ...data,
      id: pazienteId
    };

    this.pazienteService.updatePazienteInfo(payload).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Dati paziente salvati', 'Chiudi');
        this.editModePaziente.set(false);
        this.loadPazienti();
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel salvataggio', 'Chiudi');
      }
    });
  }

  openAddPazienteDialog(): void {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Ricarica la lista dei pazienti dopo l'aggiunta
        this.loadPazienti();
      }
    });
  }

  deletePaziente(pazienteId: number): void {
    if (!confirm('Sei sicuro di voler eliminare questo paziente?')) {
      return;
    }

    this.pazienteService.deletePaziente(pazienteId).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Paziente eliminato', 'Chiudi');
        this.selectedPaziente.set(null);
        this.loadPazienti();
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nell\'eliminazione', 'Chiudi');
      }
    });
  }

  // ====== AZIONI MEDICO ======

  toggleEditModeMedico(): void {
    this.editModeMedico.update(v => !v);
  }

  saveInfoMedico(data: any): void {
    const payload = {
      ...data,
      id: this.medicoId
    };

    this.medicoService.updateDoctorInfo(payload).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Informazioni medico salvate', 'Chiudi');
        this.editModeMedico.set(false);
        this.loadProfile();
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel salvataggio', 'Chiudi');
      }
    });
  }

  // ====== ALTRE AZIONI ======

  changePassword(data: { password: string; newPassword: string }): void {
    this.profileService.partialUpdate(data).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Password cambiata con successo', 'Chiudi');
      },
      error: () => {
        this.snackBar.openSnackBar('Errore: verifica la password attuale', 'Chiudi');
      }
    });
  }

  getRoleLabel(ruolo: UserRole): string {
    const labels = {
      [UserRole.PAZIENTE]: 'Paziente',
      [UserRole.MEDICO]: 'Medico',
      [UserRole.ADMIN]: 'Amministratore',
      [UserRole.TUTORE]: 'Tutore'
    };
    return labels[ruolo] || ruolo;
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  calculateAge(dataNascita: string | Date): number {
    if (!dataNascita) return 0;
    
    const today = new Date();
    const birthDate = typeof dataNascita === 'string' 
      ? new Date(dataNascita) 
      : dataNascita;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}