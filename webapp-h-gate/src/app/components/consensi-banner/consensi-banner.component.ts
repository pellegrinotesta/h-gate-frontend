import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrivacyService } from '../../services/privacy.service';
import { StatoConsenso } from '../../models/privacy.model';

/** Avviso per il tutore quando un consenso è revocato o va confermato sulla nuova informativa. */
@Component({
  selector: 'app-consensi-banner',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    @if (daGestire().length) {
    <div class="banner">
      <mat-icon>privacy_tip</mat-icon>
      <div class="testo">
        @if (revocati().length) {
          <strong>Consenso revocato per {{ nomi(revocati()) }}:</strong> non è possibile prenotare nuove visite.
        } @else {
          <strong>Informativa privacy aggiornata.</strong> Conferma il consenso per {{ nomi(daGestire()) }}.
        }
      </div>
      <a mat-flat-button color="primary" routerLink="/privacy">Gestisci consensi</a>
    </div>
    }
  `,
  styles: [`
    .banner { display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
      background: #fff8e1; border: 1px solid #ffe082; border-left: 4px solid #f9a825;
      border-radius: 8px; padding: 10px 14px; margin-bottom: 1rem; }
    .banner mat-icon { color: #b26a00; }
    .testo { flex: 1; min-width: 200px; font-size: 0.9rem; color: #5d4037; }
  `]
})
export class ConsensiBannerComponent implements OnInit {
  private privacyService = inject(PrivacyService);

  daGestire = signal<StatoConsenso[]>([]);
  revocati = signal<StatoConsenso[]>([]);

  ngOnInit(): void {
    this.privacyService.miei().subscribe({
      next: res => {
        const lista = res.data ?? [];
        this.daGestire.set(lista.filter(m => !m.aggiornato));
        this.revocati.set(lista.filter(m => !m.attivo));
      },
      error: () => undefined
    });
  }

  nomi(lista: StatoConsenso[]): string {
    return lista.map(m => m.pazienteNome).join(', ');
  }
}
