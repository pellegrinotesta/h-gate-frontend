import { Component, inject } from '@angular/core';
import { GenericDialogComponent } from '../../shared/components/generic-dialog/generic-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  message?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [GenericDialogComponent, MatButtonModule, MatDialogActions],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data? = inject<DialogData>(MAT_DIALOG_DATA);

  title = 'Conferma Operazione';

}
