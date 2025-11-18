import { Component, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {

  title = input<string>('');
  subtitle = input<string | undefined>('');

}
