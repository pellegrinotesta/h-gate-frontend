import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GenericDialogComponent } from '../../shared/components/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-privacy-content-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    GenericDialogComponent],
  templateUrl: './privacy-content-dialog.component.html',
  styleUrl: './privacy-content-dialog.component.scss'
})
export class PrivacyContentDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<PrivacyContentDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  consentGiven = false;
  currentDate = new Date();

  onAccept(): void {
    if (this.consentGiven) {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
