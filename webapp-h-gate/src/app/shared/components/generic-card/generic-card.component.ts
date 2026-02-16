import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-generic-card',
  imports: [CommonModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './generic-card.component.html',
  styleUrl: './generic-card.component.scss'
})
export class GenericCardComponent {

  title = input<string>('');
  subtitle = input<string>('');
  actions = input<any[]>([]);


}
