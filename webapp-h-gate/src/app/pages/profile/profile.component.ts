import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { UserRole } from '../../shared/enums/user-role.enum';

@Component({
  selector: 'app-profile',
  imports: [
    SharedModule,
    MatCardModule,
    LoaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BasePageComponent {

  readonly profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  user = signal<User | null>(null);
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
        this.patchForms(user);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore nel caricamento del profilo', 'Chiudi');
        this.isLoading = false;
      }
    })
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
  }

  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
    if (!this.editMode()) {
      this.patchForms(this.user()!);
    }
  }

  saveGeneralInfo() {

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
