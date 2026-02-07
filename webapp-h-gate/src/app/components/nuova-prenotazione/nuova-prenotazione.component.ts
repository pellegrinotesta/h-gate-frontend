import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { ActivatedRoute } from '@angular/router';
import { PazienteService } from '../../services/paziente.service';
import { MedicoService } from '../../services/medico.service';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { Paziente } from '../../models/paziente.model';
import { Medico } from '../../models/medico.model';
import { PrenotazioneCreate, SlotDisponibile } from '../../models/prenotazione.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TariffeMedico } from '../../models/tariffe-medico.model';

@Component({
  selector: 'app-nuova-prenotazione',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  templateUrl: './nuova-prenotazione.component.html',
  styleUrl: './nuova-prenotazione.component.scss'
})
export class NuovaPrenotazioneComponent extends BasePageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private pazienteService = inject(PazienteService);
  private medicoService = inject(MedicoService);
  private prenotazioneService = inject(PrenotazioneService);

  pazienteForm!: FormGroup;
  medicoForm!: FormGroup;
  dataOraForm!: FormGroup;
  dettagliForm!: FormGroup;

  minori = signal<Paziente[]>([]);
  medici = signal<Medico[]>([]);
  slotsDisponibili = signal<SlotDisponibile[]>([]);

  minoreSelezionato = signal<Paziente | null>(null);
  medicoSelezionato = signal<Medico | null>(null);

  isSaving = signal<boolean>(false);

  tipoVisita = signal<TariffeMedico[]>([]);

  override ngOnInit(): void {
    this.initForms();
    this.loadMinori();
    this.loadMedici();

    this.route.queryParamMap.subscribe(params => {
      if (params.has('pazienteId')) {
        this.pazienteForm.patchValue({ pazienteId: +(params.get('pazienteId') || 0) });
      }
    });
  }

  initForms() {
    this.pazienteForm = this.fb.group({
      pazienteId: ['', Validators.required]
    });

    this.medicoForm = this.fb.group({
      medicoId: ['', Validators.required]
    });

    this.dataOraForm = this.fb.group({
      data: ['', Validators.required],
      slot: ['', Validators.required]
    });

    this.dettagliForm = this.fb.group({
      tipoVisita: ['', Validators.required],
      note: [null],
      isPrimaVisita: [false]
    });
  }

  loadMinori(): void {
    this.isLoading = true;
    this.pazienteService.getPazientiByTutore().subscribe({
      next: (response) => {
        this.minori.set(response.data || []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Errore nel caricamento dei pazienti', 'Chiudi');
      }
    })
  }

  loadMedici(): void {
    this.medicoService.getAllMedici().subscribe({
      next: (response) => {
        this.medici.set(response.data || []);
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel caricamento dei medici', 'Chiudi');
      }
    })
  }

  loadTariffeMedico(medicoId: number): void {
    this.medicoService.listaTariffe(medicoId).subscribe({
      next: (response) => {
        this.tipoVisita.set(response.data || []);
      },
      error: () => {
        this.snackBar.openSnackBar('Errore nel caricamento delle prestazioni', 'Chiudi');
      }
    });
  }

  onPazienteSelected(): void {
    const pazienteId = this.pazienteForm.value.pazienteId;
    const paziente = this.minori().find(p => p.id === pazienteId) || null;
    this.minoreSelezionato.set(paziente);
  }

  onMedicoSelected(): void {
    const medicoId = this.medicoForm.get('medicoId')?.value;
    const medico = this.medici().find(m => m.id === medicoId) || null;
    this.medicoSelezionato.set(medico);

    if (medicoId) {
      this.loadTariffeMedico(medicoId);
      this.dataOraForm.get('slot')?.reset();
      this.dettagliForm.get('tipoVisita')?.reset();
    }
  }

  onDataSelected(): void {
    const data = this.dataOraForm.get('data')?.value;
    const medicoId = this.medicoForm.get('medicoId')?.value;

    if (data && medicoId) {
      this.loadSlotDisponibili(medicoId, data);
    }
  }

  loadSlotDisponibili(medicoId: number, data: Date): void {
    const dataString = this.toLocalDateString(data);

    this.prenotazioneService.getSlotDisponibili(medicoId, dataString).subscribe({
      next: (response) => {
        this.slotsDisponibili.set(response.data?.slots ?? []);
      },
      error: () => {
        this.snackBar.openSnackBar(
          'Errore nel caricamento degli slot disponibili',
          'Chiudi'
        );
      }
    });
  }

  confermaPrenotazione(): void {
    if (!this.isFormValid()) {
      this.snackBar.openSnackBar('Compila tutti i campi obbligatori', 'Chiudi');
      return;
    }

    this.isSaving.set(true);

    const slotDate: Date = this.dataOraForm.get('slot')?.value;

    const data: PrenotazioneCreate = {
      pazienteId: this.pazienteForm.get('pazienteId')?.value,
      medicoId: this.medicoForm.get('medicoId')?.value,
      dataOra: this.dataOraForm.get('slot')?.value,
      // Supponendo che il backend si aspetti la descrizione della prestazione
      tipoVisita: this.dettagliForm.get('tipoVisita')?.value,
      note: this.dettagliForm.get('note')?.value,
      isPrimaVisita: this.dettagliForm.get('isPrimaVisita')?.value
    };
    
    this.prenotazioneService.creaPrenotazione(data).subscribe({
      next: (res) => {
        if (res.ok === false) {
          this.isSaving.set(false);
          this.snackBar.openSnackBar(res.message, 'Chiudi');
          return;
        } else {
          this.isSaving.set(false);
          this.snackBar.openSnackBar('Prenotazione creata con successo', 'Chiudi');
          this.router.navigate(['/prenotazioni']);
        }

      },
      error: () => {
        this.isSaving.set(false);
        this.snackBar.openSnackBar('Errore nella creazione della prenotazione', 'Chiudi');
      }
    })
  }

  isFormValid(): boolean {
    return this.pazienteForm.valid &&
      this.medicoForm.valid &&
      this.dataOraForm.valid &&
      this.dettagliForm.valid;
  }

  getMinoreNome(id: number): string {
    const paziente = this.minori().find(p => p.id === id);
    return paziente ? `${paziente.nome} ${paziente.cognome}` : '';
  }

  getMedicoNome(id: number): string {
    const medico = this.medici().find(m => m.id === id);
    return medico ? `Dr. ${medico.user.nome} ${medico.user.cognome}` : '';
  }

  annulla(): void {
    this.router.navigate(['/dashboard']);
  }

  private toLocalDateString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  private toLocalDateTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }



}
