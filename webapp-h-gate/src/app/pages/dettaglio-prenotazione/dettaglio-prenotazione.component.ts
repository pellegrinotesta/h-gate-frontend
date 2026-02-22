import { Component, inject, input } from '@angular/core';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { SharedModule } from '../../shared/shared.module';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { FormItem } from '../../shared/models/form-item.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { Prenotazione } from '../../models/prenotazione.model';
import { AuthService } from '../../shared/services/auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { AuthenticatedUser } from '../../models/authenticated-user.model';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { RefertoDialogComponent } from '../../components/referto-dialog/referto-dialog.component';

@Component({
  selector: 'app-dettaglio-prenotazione',
  imports: [
    SharedModule,
    GenericCardComponent,
    GenericFormComponent,
    LoaderComponent,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './dettaglio-prenotazione.component.html',
  styleUrl: './dettaglio-prenotazione.component.scss',
  providers: [DatePipe]
})
export class DettaglioPrenotazioneComponent extends BasePageComponent {

  readonly prenotazioneService = inject(PrenotazioneService);
  readonly authService = inject(AuthService);
  readonly datePipe = inject(DatePipe);
  readonly dialog = inject(MatDialog);

  prenotazioneId = input<number>();
  editMode = false;
  hasReferto = false;

  title = 'Dettaglio Prenotazione';
  subtitle = '';
  titleReferto = 'Referto';
  userRole = '';
  isMedico = false;
  formItems: FormItem[] = FormConfigs.DETTAGLIO_PRENOTAZIONE_FIELDS;
  refertoFormItems: FormItem[] = FormConfigs.FORM_REFERTO_FIELDS;

  prenotazioneData: Prenotazione | null = null;

  constructor() {
    super();
    const user = this.authService.getStoredUsed();
    if (user?.authentication) {
      const decoded = jwtDecode<AuthenticatedUser>(user.authentication);
      this.userRole = decoded.authorities[0] || '';
      this.isMedico = this.userRole === 'MEDICO';
    }
  }

  override ngOnInit(): void {
    if (this.prenotazioneId()) {
      this.loadPrenotazione(this.prenotazioneId()!);
    }
  }

  goBack(): void {
    this.location.back();
  }


  private loadPrenotazione(id: number): void {
    this.isLoading = true;

    this.prenotazioneService.getById(id).subscribe({
      next: (response) => {
        const prenotazione = response.data;

        this.prenotazioneData = {
          ...prenotazione,

          dataOra: this.datePipe.transform(
            prenotazione.dataOra,
            'dd/MM/yyyy HH:mm'
          ) ?? '',

          dataOraFine: this.datePipe.transform(
            prenotazione.dataOraFine,
            'dd/MM/yyyy HH:mm'
          ) ?? '',

          dataAnnullamento: this.datePipe.transform(
            prenotazione.dataAnnullamento,
            'dd/MM/yyyy HH:mm'
          ) ?? '',

          pazienteNomeCompleto: `${prenotazione.paziente?.nome} ${prenotazione.paziente?.cognome}`,
          tutoreNomeCompleto: `${prenotazione.createdByUserId?.nome} ${prenotazione.createdByUserId?.cognome}`,
          medicoNomeCompleto: `${prenotazione.medico?.user?.nome} ${prenotazione.medico?.user?.cognome}`,
          diagnosi: prenotazione.referto?.diagnosi
        };

        this.title = `Prenotazione`;
        this.subtitle = `${prenotazione.numeroPrenotazione}`;
        this.hasReferto = !!prenotazione.referto;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore caricamento prenotazione:', error);
        this.snackBar.openSnackBar('Errore nel caricamento', 'Chiudi');
        this.isLoading = false;
      }
    });
  }

  edit() {
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
  }

  save(updatedData: any): void {
    if (!this.prenotazioneId()) {
      this.snackBar.openSnackBar('ID prenotazione mancante', 'Chiudi');
      return;
    }

    this.isLoading = true;

    const updateDTO: any = {
      id: this.prenotazioneId()
    };

    updateDTO.noteMedico = updatedData.noteMedico;
    updateDTO.diagnosi = updatedData.diagnosi;

    this.prenotazioneService.update(this.prenotazioneId()!, updateDTO).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.openSnackBar('Prenotazione aggiornata con successo', 'Chiudi');
          this.editMode = false;
          this.loadPrenotazione(this.prenotazioneId()!);
        } else {
          this.snackBar.openSnackBar('Errore durante il salvataggio', 'Chiudi');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Errore salvataggio prenotazione:', error);
        this.snackBar.openSnackBar('Errore durante il salvataggio', 'Chiudi');
        this.isLoading = false;
      }
    });

  }

  private completaPrenotazione(): void {
    this.prenotazioneService.completaPrenotazione(this.prenotazioneId()!).subscribe({
      next: (response) => {
        if (response.ok) {
          this.snackBar.openSnackBar('Prenotazione completata, puoi ora creare il referto', 'Chiudi');
          this.loadPrenotazione(this.prenotazioneId()!);
        } else {
          this.snackBar.openSnackBar('Errore completamento prenotazione', response.message);
        }
      },
      error: (error) => {
        console.error('Errore completamento prenotazione:', error);
        this.snackBar.openSnackBar('Errore durante il completamento della prenotazione', 'Chiudi');
      }
    });

  }

  apriReferto(): void {
    if (!this.prenotazioneData) return;
    const dialogRef = this.dialog.open(RefertoDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      data: {
        prenotazione: this.prenotazioneData // ← controlla che questo non sia null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.completaPrenotazione();
      if (result?.success) {
        this.snackBar.openSnackBar('Referto creato con successo', 'Chiudi');
        this.loadPrenotazione(this.prenotazioneId()!);
      }
    });
  }


}
