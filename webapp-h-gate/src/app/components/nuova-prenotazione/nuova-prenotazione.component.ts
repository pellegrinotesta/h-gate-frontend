import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
import { AllegatoService } from '../../services/allegato.service';

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
  private allegatoService = inject(AllegatoService);

  @ViewChild('stepper') stepper!: MatStepper;

  pazienteForm!: FormGroup;
  medicoForm!: FormGroup;
  dataOraForm!: FormGroup;
  dettagliForm!: FormGroup;
  orariMedico: { inizio: string; fine: string } | null = null;

  minori = signal<Paziente[]>([]);
  medici = signal<Medico[]>([]);
  slotsDisponibili = signal<SlotDisponibile[]>([]);

  minoreSelezionato = signal<Paziente | null>(null);
  medicoSelezionato = signal<Medico | null>(null);

  prenotazioneCreataId = signal<number | null>(null);
  allegatiDaCaricare = signal<File[]>([]);
  isUploadingAllegati = signal<boolean>(false);

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
        if (response.data?.message) {
          // Medico non disponibile
          this.snackBar.openSnackBar(response.data.message, 'Chiudi');
          this.slotsDisponibili.set([]);
          this.orariMedico = null;
        } else {
          // Slot disponibili
          this.slotsDisponibili.set(response.data?.slots ?? []);

          // Salva orari per visualizzazione
          if (response.data?.orarioInizio && response.data?.orarioFine) {
            this.orariMedico = {
              inizio: response.data.orarioInizio,
              fine: response.data.orarioFine
            };
          }
        }
      },
      error: (err) => {
        this.snackBar.openSnackBar(
          'Errore nel caricamento degli slot disponibili',
          'Chiudi'
        );
        this.slotsDisponibili.set([]);
        this.orariMedico = null;
      }
    });
  }

  /**
   * Seleziona uno slot
   */
  selectSlot(slot: SlotDisponibile): void {
    if (slot.disponibile) {
      this.dataOraForm.patchValue({ slot: slot.dataOra });
    } else {
      this.snackBar.openSnackBar(
        slot.motivoNonDisponibilita || 'Slot non disponibile',
        'Chiudi'
      );
    }
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
          this.prenotazioneCreataId.set(res.data.id);
          this.isSaving.set(false);
          this.snackBar.openSnackBar('Prenotazione creata con successo', 'Chiudi');
          this.stepper.next();
        }

      },
      error: () => {
        this.isSaving.set(false);
        this.snackBar.openSnackBar('Errore nella creazione della prenotazione', 'Chiudi');
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const nuovi = Array.from(input.files);
    this.allegatiDaCaricare.update(curr => [...curr, ...nuovi]);
    input.value = ''; // reset input per permettere ricaricamento stesso file
  }

  rimuoviFile(index: number): void {
    this.allegatiDaCaricare.update(curr => curr.filter((_, i) => i !== index));
  }

  uploadAllegati(): void {
    if (!this.prenotazioneCreataId() || this.allegatiDaCaricare().length === 0) {
      this.router.navigate(['/prenotazioni']);
      return;
    }

    this.isUploadingAllegati.set(true);
    const formData = new FormData();
    this.allegatiDaCaricare().forEach(f => formData.append('files', f));

    this.allegatoService.uploadAllegati(
      this.prenotazioneCreataId()!, formData
    ).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Allegati caricati con successo', 'Chiudi');
        this.router.navigate(['/prenotazioni']);
      },
      error: () => {
        this.snackBar.openSnackBar('Errore caricamento allegati', 'Chiudi');
        this.isUploadingAllegati.set(false);
      }
    });
  }

  saltaAllegati(): void {
    this.router.navigate(['/prenotazioni']);
  }

  getFileIcon(file: File): string {
    if (file.type === 'application/pdf') return 'picture_as_pdf';
    if (file.type.startsWith('image/')) return 'image';
    return 'insert_drive_file';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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
