import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, forkJoin, Observable } from 'rxjs';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { ApprovazioniService } from '../../services/approvazioni.service';
import { MedicoInAttesa, RichiestaAssociazione } from '../../models/approvazioni.model';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { RifiutoDialogComponent, RifiutoDialogData } from '../../components/rifiuto-dialog/rifiuto-dialog.component';
import { SNACKBAR } from '../../shared/enums/snackbar-class.enum';
import { ResponseDTO } from '../../shared/models/response.model';

/**
 * Pagina amministratore: approvazione dei medici registrati e delle
 * richieste di associazione tutore-minore.
 */
@Component({
  selector: 'app-approvazioni',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './approvazioni.component.html',
  styleUrl: './approvazioni.component.scss'
})
export class ApprovazioniComponent extends BasePageComponent implements OnInit {
  private approvazioniService = inject(ApprovazioniService);
  private dialog = inject(MatDialog);

  medici = signal<MedicoInAttesa[]>([]);
  richieste = signal<RichiestaAssociazione[]>([]);
  caricamento = signal(true);
  /** id dell'elemento su cui è in corso un'azione, per disabilitarne i pulsanti */
  inLavorazione = signal<string | null>(null);

  override ngOnInit(): void {
    this.carica();
  }

  carica(): void {
    this.caricamento.set(true);
    forkJoin({
      medici: this.approvazioniService.mediciInAttesa(),
      richieste: this.approvazioniService.associazioni('IN_ATTESA')
    }).pipe(finalize(() => this.caricamento.set(false)))
      .subscribe({
        next: ({ medici, richieste }) => {
          this.medici.set(medici.data ?? []);
          this.richieste.set(richieste.data ?? []);
        },
        error: (err) => this.mostraErrore(err)
      });
  }

  // ---------------------------------------------------------------- medici

  approvaMedico(m: MedicoInAttesa): void {
    this.conferma(
      `Approvare <strong>${this.escape(m.nome)} ${this.escape(m.cognome)}</strong> (${this.escape(m.specializzazione)}, albo ${this.escape(m.numeroAlbo)})?<br>` +
      `Potrà accedere e sarà prenotabile dai tutori. Verifica prima l'iscrizione all'albo.`,
      () => this.esegui(`m${m.medicoId}`, this.approvazioniService.approvaMedico(m.medicoId),
        () => this.medici.update(list => list.filter(x => x.medicoId !== m.medicoId)))
    );
  }

  rifiutaMedico(m: MedicoInAttesa): void {
    this.chiediMotivo({
      titolo: 'Rifiuta registrazione medico',
      descrizione: `L'account di ${m.nome} ${m.cognome} verrà disattivato.`
    }, motivo => this.esegui(`m${m.medicoId}`, this.approvazioniService.rifiutaMedico(m.medicoId, motivo),
      () => this.medici.update(list => list.filter(x => x.medicoId !== m.medicoId))));
  }

  // ---------------------------------------------------------- associazioni

  approvaAssociazione(r: RichiestaAssociazione): void {
    this.conferma(
      `Associare <strong>${this.escape(r.tutoreNome)} ${this.escape(r.tutoreCognome)}</strong> come ` +
      `<strong>${this.escape(r.relazione)}</strong> di <strong>${this.escape(r.pazienteNome)} ${this.escape(r.pazienteCognome)}</strong>?<br>` +
      `Avrà accesso completo alla cartella clinica del minore. Conferma solo dopo aver verificato i documenti.`,
      () => this.esegui(`a${r.id}`, this.approvazioniService.approvaAssociazione(r.id),
        () => this.richieste.update(list => list.filter(x => x.id !== r.id)))
    );
  }

  rifiutaAssociazione(r: RichiestaAssociazione): void {
    this.chiediMotivo({
      titolo: 'Rifiuta associazione',
      descrizione: `${r.tutoreNome} ${r.tutoreCognome} non verrà associato a ${r.pazienteNome} ${r.pazienteCognome}.`
    }, motivo => this.esegui(`a${r.id}`, this.approvazioniService.rifiutaAssociazione(r.id, motivo),
      () => this.richieste.update(list => list.filter(x => x.id !== r.id))));
  }

  // --------------------------------------------------------------- helpers

  private conferma(message: string, onConfirm: () => void): void {
    this.dialog.open(ConfirmDialogComponent, { data: { message } })
      .afterClosed()
      .subscribe(ok => { if (ok) onConfirm(); });
  }

  private chiediMotivo(data: RifiutoDialogData, onConfirm: (motivo: string) => void): void {
    this.dialog.open(RifiutoDialogComponent, { data })
      .afterClosed()
      .subscribe((motivo: string | null) => { if (motivo !== null && motivo !== undefined) onConfirm(motivo); });
  }

  private esegui(key: string, azione: Observable<ResponseDTO<void>>, onSuccess: () => void): void {
    this.inLavorazione.set(key);
    azione.pipe(finalize(() => this.inLavorazione.set(null))).subscribe({
      next: (res) => {
        onSuccess();
        this.snackBar.openSnackBar(res?.message ?? 'Operazione completata', 'Chiudi', SNACKBAR.SUCCESS);
      },
      error: (err) => {
        this.mostraErrore(err);
        // La richiesta potrebbe essere già stata gestita da un altro amministratore
        this.carica();
      }
    });
  }

  private mostraErrore(err: unknown): void {
    const msg = typeof err === 'string' && err ? err : 'Operazione non riuscita';
    this.snackBar.openSnackBar(msg, 'Chiudi', SNACKBAR.DANGER);
  }

  /** Il messaggio del dialog di conferma è HTML: i dati inseriti dagli utenti vanno sanificati. */
  private escape(value: string | undefined | null): string {
    return (value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]!));
  }
}
