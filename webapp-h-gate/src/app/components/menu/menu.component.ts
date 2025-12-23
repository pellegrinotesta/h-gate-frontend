import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../../shared/shared.module';
import { ITEMS_MENU } from '../../shared/constants/items-menu.constant';
import { MenuItem } from '../../shared/models/menu-item.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthFacadeService } from '../../shared/services/auth/auth-facade.service';

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

  constructor(private authFacade: AuthFacadeService) { }

  ngOnInit() {
    this.authFacade.getUser().subscribe(user => {
      const authorities = user?.authorities ?? [];

      this.menuItems = ITEMS_MENU
        .flatMap(section => section.items)
        .filter(item => this.canShow(item.permission, authorities));
    });
  }

  private canShow(
    permission: string | string[] | undefined,
    authorities: string[]
  ): boolean {

    if (!permission) return true;

    if (typeof permission === 'string') {
      return authorities.includes(permission);
    }

    if (Array.isArray(permission)) {
      return permission.some(p => authorities.includes(p));
    }

    return false;
  }


}
