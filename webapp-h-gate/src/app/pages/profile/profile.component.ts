import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { UserRole } from '../../shared/enums/user-role.enum';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Paziente } from '../../models/paziente.model';
import { Medico } from '../../models/medico.model';
import { Amministratore } from '../../models/amministratore.model';
import { MedicoService } from '../../services/medico.service';

@Component({
  selector: 'app-profile',
  imports: [
    SharedModule,
    MatCardModule,
    LoaderComponent,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BasePageComponent {

  readonly profileService = inject(ProfileService);
  readonly medicoService = inject(MedicoService);
  private fb = inject(FormBuilder);

  user = signal<User | null>(null);
  medico = signal<Medico | null>(null);
  editMode = signal<boolean>(false);
  activeTab = signal<string>('personal');

  generalForm!: FormGroup;
  specificForm!: FormGroup;
  passwordForm!: FormGroup;

  isPaziente = computed(() => this.user()?.roles.includes(UserRole.PAZIENTE) ?? false);
  isMedico = computed(() => this.user()?.roles.includes(UserRole.MEDICO) ?? false);
  isAmministratore = computed(() => this.user()?.roles.includes(UserRole.AMMINISTRATORE) ?? false);

  fullName = computed(() => {
    const u = this.user();
    return u ? `${u.nome} ${u.cognome}` : '';
  });

  override ngOnInit(): void {
    this.initForms();
    this.loadProfile();
  }

  loadDetailsMedico() {
    this.medicoService.findMedicoByUserId().subscribe({
      next: (res) => {
        this.medico.set(res.data);
        this.patchForms(this.user()!);

        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore nel recupero delle informazioni medico', 'Chiudi');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  initForms(): void {
    this.generalForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      dataNascita: [''],
      indirizzo: [''],
      citta: [''],
      provincia: ['', [Validators.maxLength(2)]],
      cap: ['', [Validators.pattern(/^[0-9]{5}$/)]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator })
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  loadProfile(): void {
    this.isLoading = true;

    this.profileService.get().subscribe({
      next: (user) => {
        this.user.set(user);
        if (user.roles.includes(UserRole.MEDICO)) {
          this.loadDetailsMedico();
        } else {
          this.patchForms(user);
          this.isLoading = false;
        }
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel caricamento del profilo', 'Chiudi');
        this.isLoading = false;
      }
    });
  }


  patchForms(user: User): void {
    this.generalForm.patchValue({
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      telefono: user.telefono,
      dataNascita: user.dataNascita,
      indirizzo: user.indirizzo,
      citta: user.citta,
      provincia: user.provincia,
      cap: user.cap
    });

    if (this.isPaziente() && this.user()) {
      const paziente = this.user() as Paziente;
      this.specificForm = this.fb.group({
        codiceFiscale: [paziente.codiceFiscale, [Validators.required, Validators.minLength(16)]],
        gruppoSanguigno: [paziente.gruppoSanguigno],
        altezzaCm: [paziente.altezzaCm, [Validators.min(50), Validators.max(250)]],
        pesoKg: [paziente.pesoKg, [Validators.min(2), Validators.max(300)]],
        allergie: [paziente.allergie],
        patologieCroniche: [paziente.patologieCroniche]
      });
    } else if (this.isMedico() && this.user()) {
      const medico = this.user() as Medico;
      this.specificForm = this.fb.group({
        specializzazione: [medico.specializzazione, Validators.required],
        numeroAlbo: [medico.numeroAlbo, Validators.required],
        universita: [medico.universita],
        annoLaurea: [medico.annoLaurea, [Validators.min(1950), Validators.max(new Date().getFullYear())]],
        bio: [medico.bio, Validators.maxLength(1000)],
        durataVisitaMinuti: [medico.durataVisitaMinuti, [Validators.min(10), Validators.max(120)]],
        isDisponibile: [medico.isDisponibile]
      });
    } else if (this.isAmministratore() && this.user()) {
      const admin = this.user() as Amministratore;
      this.specificForm = this.fb.group({
        dipartimento: [admin.dipartimento],
        livelloAccesso: [admin.livelloAccesso]
      });
    }
  }
  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
    if (!this.editMode()) {
      this.patchForms(this.user()!);
    }
  }

  saveGeneralInfo() {

  }

  saveSpecificInfo() {

  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const { oldPassword, newPassword } = this.passwordForm.value;
    // this.loading.set(true);

    // this.profileService.changePassword(oldPassword, newPassword).subscribe({
    //   next: () => {
    //     this.successMessage.set('Password cambiata con successo');
    //     this.passwordForm.reset();
    //     this.activeTab.set('general');
    //     this.loading.set(false);
    //     setTimeout(() => this.successMessage.set(null), 3000);
    //   },
    //   error: (err) => {
    //     this.errorMessage.set('Errore: verifica la password attuale');
    //     this.loading.set(false);
    //     setTimeout(() => this.errorMessage.set(null), 3000);
    //   }
    // });
  }

  getRoleLabel(ruolo: UserRole): string {
    const labels = {
      [UserRole.PAZIENTE]: 'Paziente',
      [UserRole.MEDICO]: 'Medico',
      [UserRole.AMMINISTRATORE]: 'Amministratore'
    };
    return labels[ruolo] || ruolo
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

}
