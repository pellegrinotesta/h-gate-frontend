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
import { RoutesEnum } from '../../shared/enums/routes.enum';
import { AuthService } from '../../shared/services/auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { AuthenticatedUser } from '../../models/authenticated-user.model';

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
  readonly authService = inject(AuthService);
  prenotazioneId = input<number>();
  editMode = false;

  title = 'Dettaglio Prenotazione';
  subtitle = '';
  userRole = '';
  isMedico = false;
  formItems: FormItem[] = FormConfigs.DETTAGLIO_PRENOTAZIONE_FIELDS;

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
    this.router.navigate([`${RoutesEnum.PRENOTAZIONI}`]);
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

          tutoreNomeCompleto: `${prenotazione.createdByUserId?.nome} ${prenotazione.createdByUserId?.cognome}`,

          medicoNomeCompleto: `${prenotazione.medico?.user?.nome} ${prenotazione.medico?.user?.cognome}`,

          diagnosi: prenotazione.referto?.diagnosi

          //   // Recensione (se esiste)
          //   recensione: prenotazione.recensione?.commento
        };

        this.title = `Prenotazione`;
        this.subtitle = `${prenotazione.numeroPrenotazione}`;
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
