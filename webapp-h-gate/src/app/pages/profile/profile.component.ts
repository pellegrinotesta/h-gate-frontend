import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
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

  user = signal<User | null>(null);
  editMode = signal<boolean>(false);
  activeTab = signal<string>('general');

  // Configurazioni dei form
  readonly generalInfoFields = FormConfigs.GENERAL_INFO_FIELDS;
  readonly patientInfoFields = FormConfigs.PATIENT_INFO_FIELDS;
  readonly doctorInfoFields = FormConfigs.DOCTOR_INFO_FIELDS;
  readonly passwordChangeFields = FormConfigs.PASSWORD_CHANGE_FIELDS;

  // Custom validator per il form password
  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const group = control as FormGroup;
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  };

  isPaziente = computed(() => this.user()?.roles.includes(UserRole.PAZIENTE) ?? false);
  isMedico = computed(() => this.user()?.roles.includes(UserRole.MEDICO) ?? false);
  isAmministratore = computed(() => this.user()?.roles.includes(UserRole.AMMINISTRATORE) ?? false);

  fullName = computed(() => {
    const u = this.user();
    return u ? `${u.nome} ${u.cognome}` : '';
  });

  override ngOnInit(): void {
    this.loadProfile();
  }

  loadDetailsMedico() {
    this.medicoService.findMedicoByUserId().subscribe({
      next: (res) => {
        if (this.user()) {
          this.user.set({ ...this.user()!, ...res.data });
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

  loadDetailsPaziente() {
    this.pazienteService.findByUserId().subscribe({
      next: (res) => {
        if (this.user()) {
          this.user.set({ ...this.user()!, ...res.data });
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore nel recupero delle informazioni paziente', 'Chiudi');
        console.error(err);
        this.isLoading = false;
      }
    })
  }


  loadProfile(): void {
    this.isLoading = true;

    this.profileService.get().subscribe({
      next: (user) => {
        this.user.set(user);
        console.log('CHIAMATA loadProfile');
        console.log('Profile ricevuto:', user.roles);
        console.log('isMedico?', user.roles.includes(UserRole.MEDICO));
        console.log('isPaziente?', user.roles.includes(UserRole.PAZIENTE));

        if (Array.isArray(user.roles)) {
          if (user.roles.includes(UserRole.MEDICO)) {
            this.loadDetailsMedico();
          } else if (user.roles.includes(UserRole.PAZIENTE)) {
            this.loadDetailsPaziente();
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

  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
  }

  saveGeneralInfo(data: any): void {
    console.log('Saving general info:', data);

    // Esempio di chiamata API
    // this.profileService.updateGeneralInfo(data).subscribe({
    //   next: () => {
    //     this.snackBar.openSnackBar('Informazioni generali salvate', 'Chiudi');
    //     this.editMode.set(false);
    //     this.loadProfile();
    //   },
    //   error: (err) => {
    //     this.snackBar.openSnackBar('Errore nel salvataggio', 'Chiudi');
    //   }
    // });

    this.snackBar.openSnackBar('Informazioni generali salvate', 'Chiudi');
    this.editMode.set(false);
  }

  saveSpecificInfo(data: any): void {
    console.log('Saving specific info:', data);

    if (this.isPaziente()) {
      // this.profileService.updatePatientInfo(data).subscribe({...});
    } else if (this.isMedico()) {
      // this.medicoService.updateDoctorInfo(data).subscribe({...});
    }

    this.snackBar.openSnackBar('Informazioni specifiche salvate', 'Chiudi');
    this.editMode.set(false);
  }

  changePassword(data: { oldPassword: string, newPassword: string }): void {
    console.log('Changing password');

    // this.profileService.changePassword(data.oldPassword, data.newPassword).subscribe({
    //   next: () => {
    //     this.snackBar.openSnackBar('Password cambiata con successo', 'Chiudi');
    //   },
    //   error: (err) => {
    //     this.snackBar.openSnackBar('Errore: verifica la password attuale', 'Chiudi');
    //   }
    // });

    this.snackBar.openSnackBar('Password cambiata con successo', 'Chiudi');
  }

  getRoleLabel(ruolo: UserRole): string {
    const labels = {
      [UserRole.PAZIENTE]: 'Paziente',
      [UserRole.MEDICO]: 'Medico',
      [UserRole.AMMINISTRATORE]: 'Amministratore'
    };
    return labels[ruolo] || ruolo;
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }
}