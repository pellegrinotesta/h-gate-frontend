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

@Component({
  selector: 'app-dettaglio-prenotazione',
  imports: [
    SharedModule,
    GenericCardComponent,
    GenericFormComponent,
    LoaderComponent,
    MatTooltipModule
  ],
  templateUrl: './dettaglio-prenotazione.component.html',
  styleUrl: './dettaglio-prenotazione.component.scss'
})
export class DettaglioPrenotazioneComponent extends BasePageComponent {

  readonly prenotazioneService = inject(PrenotazioneService);
  prenotazioneId = input<number>();
  editMode = false;

  title = 'Dettaglio Prenotazione';
  formItems: FormItem[] = FormConfigs.DETTAGLIO_PRENOTAZIONE_FIELDS;

  prenotazioneData: Prenotazione | null = null;

  override ngOnInit(): void {
    if (this.prenotazioneId()) {
      this.loadPrenotazione(this.prenotazioneId()!);
    }
  }

  private loadPrenotazione(id: number): void {
    this.isLoading = true;

    this.prenotazioneService.getById(id).subscribe({
      next: (response) => {
        const prenotazione = response.data;

        // Appiattisci i dati per il form
        this.prenotazioneData = {
          ...prenotazione,
    
          pazienteNomeCompleto: `${prenotazione.paziente?.nome} ${prenotazione.paziente?.cognome}`,

          // Medico
          medicoNomeCompleto: `${prenotazione.medico?.user?.nome} ${prenotazione.medico?.user?.cognome}`,

          // Referto (se esiste)
          diagnosi: prenotazione.referto?.diagnosi

        //   // Recensione (se esiste)
        //   recensione: prenotazione.recensione?.commento
        };

        this.title = `Prenotazione ${prenotazione.numeroPrenotazione}`;
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

}
