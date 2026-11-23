import { Component, inject } from '@angular/core';
import { errorMessage } from '../../shared/utils/error-message';
import { SharedModule } from '../../shared/shared.module';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { Notifica, TipoNotificaIcons } from '../../models/notifica.model';
import { NotificheService } from '../../shared/services/notifiche.service';
import { AuthFacadeService } from '../../shared/services/auth/auth-facade.service';
import { ITEMS_MENU } from '../../shared/constants/items-menu.constant';

/** Titoli per le pagine che non sono voci di menu */
const TITOLI_EXTRA: { prefix: string; title: string }[] = [
  { prefix: '/profile', title: 'Il mio profilo' },
  { prefix: '/prenotazioni/nuova', title: 'Nuova prenotazione' },
  { prefix: '/prenotazioni/', title: 'Dettaglio prenotazione' },
  { prefix: '/referti/', title: 'Cartella clinica' },
  { prefix: '/referti', title: 'Referti' },
  { prefix: '/medici', title: 'Specialisti' },
  { prefix: '/pazienti/', title: 'Cartella clinica' },
];

const ETICHETTE_RUOLO: Record<string, string> = {
  ADMIN: 'Amministratore',
  MEDICO: 'Specialista',
  TUTORE: 'Tutore',
  PAZIENTE: 'Paziente',
};

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

  private readonly authFacade = inject(AuthFacadeService);

  me: User | undefined;
  roleLabel = '';
  pageTitle = '';
  sidebarOpen = false;

  get initials(): string {
    if (!this.me) return '';
    return `${this.me.nome?.[0] ?? ''}${this.me.cognome?.[0] ?? ''}`.toUpperCase();
  }

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
    this.authFacade.getUser().subscribe(user => {
      const ruolo = (user?.authorities ?? []).find(a => ETICHETTE_RUOLO[a]);
      this.roleLabel = ruolo ? ETICHETTE_RUOLO[ruolo] : '';
    });
    this.updateTitle(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.onDestroy$))
      .subscribe(e => {
        this.updateTitle((e as NavigationEnd).urlAfterRedirects);
        this.sidebarOpen = false;
      });
  }

  private updateTitle(url: string): void {
    const path = url.split('?')[0];
    const extra = TITOLI_EXTRA.find(t => path.startsWith(t.prefix));
    if (extra) { this.pageTitle = extra.title; return; }
    const voce = ITEMS_MENU.flatMap(s => s.items).find(i => i.link && path.startsWith('/' + i.link));
    this.pageTitle = voce?.title ?? 'Home';
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
      console.log('Marcando notifica come letta: ', notifica.id);
      this.notificaService.marcaComeLetta(notifica.id).subscribe({
        next: () => {
          this.snackBar.openSnackBar('Notifica segnata come letta', 'Chiudi');
        },
        error: (err) => {
          this.snackBar.openSnackBar(errorMessage(err, 'Errore durante l\'aggiornamento della notifica'), 'Chiudi');
        }
      });
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
        this.snackBar.openSnackBar(errorMessage(err, 'Errore durante l\'aggiornamento'), 'Chiudi');
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