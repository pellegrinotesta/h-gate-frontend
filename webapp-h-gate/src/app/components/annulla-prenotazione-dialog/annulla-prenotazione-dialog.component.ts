import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface DialogData {
  prenotazioneId: number;
  pazienteNome?: string;
}

@Component({
  selector: 'app-annulla-prenotazione-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './annulla-prenotazione-dialog.component.html',
  styleUrl: './annulla-prenotazione-dialog.component.scss'
})
export class AnnullaPrenotazioneDialogComponent {

  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AnnullaPrenotazioneDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  form: FormGroup = this.fb.group({
    motivo: ['', [Validators.required, Validators.maxLength(500)]]
  });

  get motivoLength(): number {
    return this.form.get('motivo')?.value?.length ?? 0;
  }

  conferma(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.motivo);
  }

  annulla(): void {
    this.dialogRef.close(null);
  }

}
