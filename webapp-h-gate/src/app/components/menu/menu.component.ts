import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { ITEMS_MENU } from '../../shared/constants/items-menu.constant';
import { MenuItem } from '../../shared/models/menu-item.model';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthFacadeService } from '../../shared/services/auth/auth-facade.service';
import { Paziente } from '../../models/paziente.model';
import { MinoriStateService } from '../../shared/services/minore.service';
import { RoutesEnum } from '../../shared/enums/routes.enum';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  private authFacade = inject(AuthFacadeService);
  private router = inject(Router);

  menuItems: MenuItem[] = [];
  isTutore = false;


  readonly minoreSelezionato = signal<Paziente | null>(null);

  ngOnInit(): void {
    this.authFacade.getUser().subscribe(user => {
      const authorities = user?.authorities ?? [];

      this.menuItems = ITEMS_MENU
        .flatMap(section => section.items)
        .filter(item => this.canShow(item.permission, authorities));

      this.isTutore = authorities.includes('TUTORE');
    });
  }
  private canShow(permission: string | string[] | undefined, authorities: string[]): boolean {
    if (!permission) return true;
    if (typeof permission === 'string') return authorities.includes(permission);
    if (Array.isArray(permission)) return permission.some(p => authorities.includes(p));
    return false;
  }
}