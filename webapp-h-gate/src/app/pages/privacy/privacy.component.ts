import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { PrivacyService } from '../../services/privacy.service';
import { AccessoPaziente, AZIONI_LEGGIBILI, RISORSE_LEGGIBILI, StatoConsenso } from '../../models/privacy.model';
import { PrivacyContentDialogComponent } from '../../components/privacy-content-dialog/privacy-content-dialog.component';
import { RifiutoDialogComponent } from '../../components/rifiuto-dialog/rifiuto-dialog.component';
import { SNACKBAR } from '../../shared/enums/snackbar-class.enum';
import { errorMessage } from '../../shared/utils/error-message';

/** Pagina del tutore: consensi privacy dei minori e accessi ai loro dati. */
@Component({
  selector: 'app-privacy',
  imports: [DatePipe, MatButtonModule, MatExpansionModule, MatIconModule, MatProgressBarModule],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent extends BasePageComponent implements OnInit {
  private privacyService = inject(PrivacyService);
  private dialog = inject(MatDialog);

  readonly azioni: Record<string, string> = AZIONI_LEGGIBILI;
  readonly risorse: Record<string, string> = RISORSE_LEGGIBILI;

  minori = signal<StatoConsenso[]>([]);
  caricamento = signal(true);
  inLavorazione = signal<number | null>(null);
  /** dettaglio (storico) e accessi caricati quando si apre il pannello */
  dettagli = signal<Record<number, StatoConsenso | undefined>>({});
  accessi = signal<Record<number, AccessoPaziente[] | undefined>>({});

  override ngOnInit(): void {
    this.carica();
  }

  carica(): void {
    this.caricamento.set(true);
    this.privacyService.miei().pipe(finalize(() => this.caricamento.set(false))).subscribe({
      next: res => this.minori.set(res.data ?? []),
      error: err => this.snackBar.openSnackBar(errorMessage(err, 'Errore nel caricamento dei consensi'), 'Chiudi')
    });
  }

  apriDettaglio(m: StatoConsenso): void {
    if (!this.dettagli()[m.pazienteId]) {
      this.privacyService.stato(m.pazienteId).subscribe({
        next: res => this.dettagli.update(d => ({ ...d, [m.pazienteId]: res.data })),
        error: () => undefined
      });
    }
    if (!this.accessi()[m.pazienteId]) {
      this.privacyService.accessi(m.pazienteId).subscribe({
        next: res => this.accessi.update(a => ({ ...a, [m.pazienteId]: res.data ?? [] })),
        error: () => undefined
      });
    }
  }

  concedi(m: StatoConsenso): void {
    this.dialog.open(PrivacyContentDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { minoreName: `${m.pazienteNome} ${m.pazienteCognome}`, codiceFiscale: '' }
    }).afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;
      this.inLavorazione.set(m.pazienteId);
      this.privacyService.concedi(m.pazienteId).pipe(finalize(() => this.inLavorazione.set(null))).subscribe({
        next: res => this.aggiorna(res.data, 'Consenso registrato'),
        error: err => this.snackBar.openSnackBar(errorMessage(err, 'Errore nella registrazione del consenso'), 'Chiudi')
      });
    });
  }

  revoca(m: StatoConsenso): void {
    this.dialog.open(RifiutoDialogComponent, {
      data: {
        titolo: 'Revoca consenso',
        sottotitolo: 'La clinica verrà avvisata',
        confermaLabel: 'Revoca consenso',
        icona: 'no_accounts',
        descrizione: `Revocando il consenso non sarà più possibile prenotare visite per ${m.pazienteNome}. `
          + 'La documentazione clinica già prodotta resta conservata dalla clinica come previsto dalla legge. '
          + 'Potrai prestare di nuovo il consenso in qualsiasi momento.'
      }
    }).afterClosed().subscribe((motivo: string | null) => {
      if (motivo === null || motivo === undefined) return;
      this.inLavorazione.set(m.pazienteId);
      this.privacyService.revoca(m.pazienteId, motivo).pipe(finalize(() => this.inLavorazione.set(null))).subscribe({
        next: res => this.aggiorna(res.data, 'Consenso revocato'),
        error: err => this.snackBar.openSnackBar(errorMessage(err, 'Errore nella revoca del consenso'), 'Chiudi')
      });
    });
  }

  private aggiorna(stato: StatoConsenso, messaggio: string): void {
    this.minori.update(list => list.map(x => x.pazienteId === stato.pazienteId ? { ...stato, storico: undefined } : x));
    this.dettagli.update(d => ({ ...d, [stato.pazienteId]: stato }));
    this.snackBar.openSnackBar(messaggio, 'Chiudi', SNACKBAR.SUCCESS);
  }
}
