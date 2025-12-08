import { Component, computed, inject, signal } from '@angular/core';
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


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, MatCardModule, MatStepperModule, GenericFormComponent, MatProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  selectedRole = signal<UserRole | null>(null);
  currentStep = signal<number>(0);
  isLoading = signal<boolean>(false);

  generalData: any = null;
  specificData: any = null;

  private router = inject(Router);
  private registrationService = inject(RegistrationService);
  readonly UserRole = UserRole;

  readonly generalInfoFields = FormConfigs.REGISTRATION_GENERAL_FIELDS;
  readonly patientInfoFields = FormConfigs.PATIENT_INFO_FIELDS;
  readonly doctorInfoFields = FormConfigs.DOCTOR_INFO_FIELDS;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {
      passwordMismatch: true
    };
  }

  specificFields = computed(() => {
    return this.selectedRole() === UserRole.PAZIENTE
      ? this.patientInfoFields
      : this.doctorInfoFields;
  });

  selectRole(role: UserRole) {
    this.selectedRole.set(role);
    this.currentStep.set(1);
  }

  saveGeneralData(data: any): void {
    this.generalData = data;
    this.currentStep.set(2);
  }

  saveSpecificData(data: any): void {
    this.specificData = data;
    this.submitRegistration();
  }

  submitRegistration(): void {
    this.isLoading.set(true);

    const registrationData = {
      ...this.generalData,
      ...this.specificData,
      ruolo: this.selectedRole()
    };

    console.log('Registration Data:', registrationData);

    // Simula chiamata API
    setTimeout(() => {
      this.registrationService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Registration error:', error);
        }
      });

      this.isLoading.set(false);
      alert('Registrazione completata! (simulata)');
      this.router.navigate(['/login']);
    }, 1500);
  }

  goBack(): void {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getRoleIcon(role: UserRole): string {
    return role === UserRole.PAZIENTE ? 'person' : 'local_hospital';
  }

  getRoleTitle(role: UserRole): string {
    return role === UserRole.PAZIENTE ? 'Registrati come Paziente' : 'Registrati come Medico';
  }

  getRoleDescription(role: UserRole): string {
    return role === UserRole.PAZIENTE
      ? 'Prenota visite, gestisci le tue cartelle cliniche e resta in contatto con i tuoi medici'
      : 'Gestisci i tuoi pazienti, gli appuntamenti e la tua agenda professionale';
  }

}
