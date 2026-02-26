import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TariffeMedico } from '../../models/tariffe-medico.model';
import { TariffeMediciService } from '../../services/tariffe-medici.service';

@Component({
  selector: 'app-tariffe-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatSlideToggleModule,
    MatTooltipModule,
    CurrencyPipe,
  ],
  templateUrl: './tariffe-dialog.component.html',
  styleUrl: './tariffe-dialog.component.scss'
})
export class TariffeDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TariffeDialogComponent>);
  private tariffeService = inject(TariffeMediciService);
  data = inject(MAT_DIALOG_DATA);

  tariffe = signal<TariffeMedico[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  showForm = signal(false);
  tariffeInModifica = signal<TariffeMedico | null>(null);

  form!: FormGroup;

  displayedColumns = ['tipoVisita', 'costo', 'durata', 'primaVisita', 'attiva', 'azioni'];

  ngOnInit(): void {
    this.initForm();
    this.loadTariffe();
  }

  initForm(): void {
    this.form = this.fb.group({
      tipoVisita: ['', Validators.required],
      costo: [null, [Validators.required, Validators.min(0)]],
      durataMinuti: [30, [Validators.required, Validators.min(5)]],
      isPrimaVisita: [false],
      isAttiva: [true],
    });
  }

  loadTariffe(): void {
    this.isLoading.set(true);
    this.tariffeService.getMie().subscribe({
      next: (res: any) => {
        this.tariffe.set([]);  // ← svuota prima
        this.tariffe.set(res.data ?? res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  apriForm(tariffa?: TariffeMedico): void {
    this.showForm.set(true);
    if (tariffa) {
      this.tariffeInModifica.set(tariffa);
      this.form.patchValue(tariffa);
    } else {
      this.tariffeInModifica.set(null);
      this.form.reset({ durataMinuti: 30, isPrimaVisita: false, isAttiva: true });
    }
  }

  annullaForm(): void {
    this.showForm.set(false);
    this.tariffeInModifica.set(null);
    this.form.reset();
  }

  salva(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);

    const dto = this.form.value;
    const inModifica = this.tariffeInModifica();

    const obs = inModifica
      ? this.tariffeService.updateTariffe(inModifica.id!, dto)
      : this.tariffeService.create(dto);

    obs.subscribe({
      next: () => {
        this.loadTariffe();
        this.annullaForm();
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false)
    });
  }

  toggleAttiva(tariffa: TariffeMedico): void {
    this.tariffeService.toggleAttiva(tariffa.id!).subscribe({
      next: (res: any) => {
        const aggiornata = res.data ?? res;
        this.tariffe.set(
          this.tariffe().map(t => t.id === aggiornata.id ? { ...aggiornata } : t)
        );
      }
    });
  }

  elimina(tariffa: TariffeMedico): void {
    if (!confirm(`Eliminare la tariffa "${tariffa.tipoVisita}"?`)) return;
    this.tariffeService.delete(tariffa.id!).subscribe({
      next: () => this.loadTariffe()
    });
  }

  chiudi(): void {
    this.dialogRef.close(true);
  }
}
