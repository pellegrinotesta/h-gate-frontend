import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface RifiutoDialogData {
  titolo: string;
  descrizione: string;
}

/** Chiede conferma del rifiuto e un motivo facoltativo, inviato all'interessato via email. */
@Component({
  selector: 'app-rifiuto-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './rifiuto-dialog.component.html',
  styleUrl: './rifiuto-dialog.component.scss'
})
export class RifiutoDialogComponent {
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<RifiutoDialogComponent, string | null>);
  readonly data = inject<RifiutoDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    motivo: ['', [Validators.maxLength(500)]]
  });

  get motivoLength(): number {
    return this.form.value.motivo?.length ?? 0;
  }

  conferma(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.motivo?.trim() ?? '');
  }

  annulla(): void {
    this.dialogRef.close(null);
  }
}
