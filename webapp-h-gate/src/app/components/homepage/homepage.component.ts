import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { Notifica, TipoNotificaIcons } from '../../models/notifica.model';
import { NotificheService } from '../../shared/services/notifiche.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    SharedModule,
    MenuComponent,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent extends BasePageComponent {

  readonly notificaService = inject(NotificheService);

  me: User | undefined;

  // Accessor per i signal delle notifiche
  get notificheNonLette() {
    return this.notificaService.notificheNonLette();
  }

  get conteggioNonLette() {
    return this.notificaService.conteggioNonLette();
  }

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    super();
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getById().subscribe({
      next: (res) => {
        this.me = res.data;
      },
      error: (err) => {
        console.error('Errore nel recupero dei dati: ', err);
      }
    });
  }

  /**
   * Gestisce il click su una notifica
   */
  onNotificaClick(notifica: Notifica, event: Event): void {
    event.stopPropagation();

    // Marca come letta
    if (!notifica.isLetta) {
      this.notificaService.marcaComeLetta(notifica.id).subscribe();
    }

    // Naviga al link se presente
    if (notifica.link) {
      this.router.navigate([notifica.link]);
    }
  }

  /**
   * Marca tutte le notifiche come lette
   */
  marcaTutteComeLette(): void {
    this.notificaService.marcaTutteComeLette().subscribe({
      next: () => {
        this.snackBar.openSnackBar('Tutte le notifiche sono state segnate come lette', 'Chiudi');
      },
      error: (err) => {
        this.snackBar.openSnackBar('Errore durante l\'aggiornamento', err);
      }
    });
  }

  /**
   * Ottiene l'icona per il tipo di notifica
   */
  getNotificaIcon(tipo: string): string {
    return TipoNotificaIcons[tipo as keyof typeof TipoNotificaIcons] || 'notifications';
  }

  /**
   * Formatta la data della notifica in modo relativo
   */
  getTempoRelativo(dataStr: string): string {
    const data = new Date(dataStr);
    const ora = new Date();
    const diffMs = ora.getTime() - data.getTime();
    const diffMinuti = Math.floor(diffMs / 60000);
    const diffOre = Math.floor(diffMinuti / 60);
    const diffGiorni = Math.floor(diffOre / 24);

    if (diffMinuti < 1) return 'Adesso';
    if (diffMinuti < 60) return `${diffMinuti}m fa`;
    if (diffOre < 24) return `${diffOre}h fa`;
    if (diffGiorni < 7) return `${diffGiorni}g fa`;

    return data.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short'
    });
  }

  onLogout() {
    this.authService.logout();
  }
}