import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../../shared/shared.module';
import { ITEMS_MENU } from '../../shared/constants/items-menu.constant';
import { MenuItem } from '../../shared/models/menu-item.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,        
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = ITEMS_MENU.flatMap(section => {
      // Sezione con titolo
      if (section.title) {
        return section.items.map(item => ({
          title: item.title,
          link: item.link,
          tooltip: item.tooltip,
          permission: item.permission
        }));
      }

      // Sezione senza titolo
      return section.items.map(item => ({
        title: item.title,
        link: item.link,
        tooltip: item.tooltip,
        permission: item.permission
      }));
    });
  }


}
