import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DisponibilitaMedicoService } from '../../services/disponibilita-medico.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { DisponibilitaMedico, GIORNI_SETTIMANA } from '../../models/disponibilita-medico.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-disponibilita-medico',
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './disponibilita-medico.component.html',
  styleUrl: './disponibilita-medico.component.scss'
})
export class DisponibilitaMedicoComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DisponibilitaMedicoComponent>);
  readonly fb = inject(FormBuilder);
  readonly disponibilitaService = inject(DisponibilitaMedicoService);
  readonly snackBar = inject(SnackbarService);

  giorni = GIORNI_SETTIMANA;
  disponibilita = signal<Map<number, DisponibilitaMedico>>(new Map());
  forms = signal<Map<number, FormGroup>>(new Map());
  isLoading = signal(false);
  isSaving = signal(false);


  ngOnInit(): void {
    this.loadDisponibilita();
    this.inizializeForms();
  }

  loadDisponibilita() {
    this.isLoading.set(true);
    this.disponibilitaService.getDisponibilita(1).subscribe({
      next: (res) => {
        const map = new Map<number, DisponibilitaMedico>();
        res.data.forEach(d => {
          map.set(d.giornoSettimana, d);
        })
        this.disponibilita.set(map);
        this.updateFormsFromData();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore nel caricamento delle disponibilità', 'Chiudi');
        this.isLoading.set(false);
      }

    });
  }

  inizializeForms() {
    const formsMap = new Map<number, FormGroup>();

    this.giorni.forEach(g => {
      const form = this.fb.group({
        isAttiva: [false],
        oraInizio: ['09:00', Validators.required],
        oraFine: ['17:00', Validators.required],
        note: ['']
      });
      formsMap.set(g.valore, form);
    })
    this.forms.set(formsMap);
  }


  updateFormsFromData() {
    this.disponibilita().forEach((d, k) => {
      const form = this.forms().get(k);
      if (form) {
        form.patchValue({
          isAttiva: d.isAttiva,
          oraInizio: d.oraInizio,
          oraFine: d.oraFine,
          note: d.note
        });
      }
    });
  }

  /**
 * Ottiene il form per un giorno specifico
 */
  getForm(giornoSettimana: number): FormGroup {
    return this.forms().get(giornoSettimana)!;
  }

  /**
   * Verifica se un giorno è attivo
   */
  isGiornoAttivo(giornoSettimana: number): boolean {
    const form = this.forms().get(giornoSettimana);
    return form?.get('isAttiva')?.value || false;
  }

  /**
   * Toggle stato giorno
   */
  toggleGiorno(giornoSettimana: number): void {
    const form = this.getForm(giornoSettimana);
    const isAttiva = form.get('isAttiva')?.value;

    if (isAttiva) {
      // Abilita i campi
      form.get('oraInizio')?.enable();
      form.get('oraFine')?.enable();
      form.get('note')?.enable();
    } else {
      // Disabilita i campi
      form.get('oraInizio')?.disable();
      form.get('oraFine')?.disable();
      form.get('note')?.disable();
    }
  }

  /**
   * Salva la disponibilità per un singolo giorno
   */
  salvaGiorno(giornoSettimana: number): void {
    const form = this.getForm(giornoSettimana);

    if (!form.get('isAttiva')?.value) {
      // Se non è attivo, elimina o disabilita
      if (this.disponibilita().has(giornoSettimana)) {
        this.disabilitaGiorno(giornoSettimana);
      }
      return;
    }

    if (form.invalid) {
      this.snackBar.openSnackBar('Compila tutti i campi obbligatori', 'Chiudi');
      return;
    }

    const dto: DisponibilitaMedico = {
      medicoId: 0, // Verrà impostato dal backend
      giornoSettimana: giornoSettimana,
      oraInizio: form.get('oraInizio')?.value,
      oraFine: form.get('oraFine')?.value,
      isAttiva: true,
      note: form.get('note')?.value
    };

    this.isSaving.set(true);
    this.disponibilitaService.salvaDisponibilita(dto).subscribe({
      next: (res) => {
        const newMap = new Map(this.disponibilita());
        newMap.set(giornoSettimana, res.data);
        this.disponibilita.set(newMap);

        this.snackBar.openSnackBar('Disponibilità salvata', 'Chiudi');
        this.isSaving.set(false);
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore salvataggio disponibilità', 'Chiudi');
        this.isSaving.set(false);
      }
    });
  }

  /**
   * Disabilita un giorno
   */
  disabilitaGiorno(giornoSettimana: number): void {
    this.disponibilitaService.disabilitaGiorno(giornoSettimana).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Giorno disabilitato', 'Chiudi');
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore disabilitazione giorno', 'Chiudi');
      }
    });
  }

  /**
   * Configura disponibilità standard (Lun-Ven 9-17)
   */
  configuraStandard(): void {
    if (!confirm('Questa operazione sovrascriverà le disponibilità esistenti. Continuare?')) {
      return;
    }

    this.isSaving.set(true);
    this.disponibilitaService.configuraStandard().subscribe({
      next: (res) => {
        this.snackBar.openSnackBar('Disponibilità standard configurata', 'Chiudi');
        this.loadDisponibilita();
        this.isSaving.set(false);
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore configurazione disponibilità standard', 'Chiudi');
        this.isSaving.set(false);
      }
    });
  }

  /**
   * Salva tutto
   */
  salvaTutto(): void {
    let salvati = 0;
    const totale = this.giorni.filter(g => this.isGiornoAttivo(g.valore)).length;

    if (totale === 0) {
      this.snackBar.openSnackBar('Nessun giorno attivo da salvare', 'Chiudi');
      return;
    }

    this.giorni.forEach(giorno => {
      if (this.isGiornoAttivo(giorno.valore)) {
        const form = this.getForm(giorno.valore);

        if (form.valid) {
          const dto: DisponibilitaMedico = {
            medicoId: 0,
            giornoSettimana: giorno.valore,
            oraInizio: form.get('oraInizio')?.value,
            oraFine: form.get('oraFine')?.value,
            isAttiva: true,
            note: form.get('note')?.value
          };

          this.disponibilitaService.salvaDisponibilita(dto).subscribe({
            next: () => {
              salvati++;
              if (salvati === totale) {
                this.snackBar.openSnackBar('Tutte le disponibilità salvate', 'Chiudi');
                this.dialogRef.close(true);
              }
            }
          });
        }
      }
    });
  }

  chiudi(): void {
    this.dialogRef.close();
  }



}
