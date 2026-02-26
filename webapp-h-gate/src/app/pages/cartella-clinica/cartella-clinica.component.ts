import { Component, inject, input, signal } from '@angular/core';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { SharedModule } from '../../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { Paziente } from '../../models/paziente.model';
import { Referto } from '../../models/referto.model';
import { FormItem } from '../../shared/models/form-item.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { ValutazionePsicologica } from '../../models/valutazione-psicologica.model';
import { PercorsoTerapeutico } from '../../models/percorso-terapeutico.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin } from 'rxjs';
import { PazienteService } from '../../services/paziente.service';
import { RefertoService } from '../../services/referto.service';
import { PercorsoTerapeuticoService } from '../../services/percorso-terapeutico.service';
import { ValutazionePsicologicaService } from '../../services/valutazione-psicologica.service';
import { RoutesEnum } from '../../shared/enums/routes.enum';
import { AllegatoService } from '../../services/allegato.service';
import { Allegato } from '../../models/allegato.model';

@Component({
  selector: 'app-cartella-clinica',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericFormComponent,
    MatChipsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './cartella-clinica.component.html',
  styleUrl: './cartella-clinica.component.scss'
})
export class CartellaClinicaComponent extends BasePageComponent {

  readonly pazientiService = inject(PazienteService);
  readonly refertoService = inject(RefertoService);
  readonly percorsoService = inject(PercorsoTerapeuticoService);
  readonly valutazioniService = inject(ValutazionePsicologicaService);
  readonly allegatoService = inject(AllegatoService);

  paziente = signal<Paziente | null>(null);
  referti = signal<Referto[]>([]);
  valutazioni = signal<ValutazionePsicologica[]>([]);
  percorsi = signal<PercorsoTerapeutico[]>([]);
  allegati = signal<Allegato[]>([]);

  refertoSelezionato = signal<Referto | null>(null);
  valutazioneSelezionata = signal<ValutazionePsicologica | null>(null);
  percorsoSelezionato = signal<PercorsoTerapeutico | null>(null);
  isExporting = signal(false);

  pazienteId = input<number>();

  readonly today = new Date();

  anagraficaFields: FormItem[] = FormConfigs.FORM_ANAGRAFICA_PAZIENTE_FIELDS;
  refertiFields: FormItem[] = FormConfigs.FORM_REFERTO_FIELDS;
  valutazioneFields: FormItem[] = FormConfigs.FORM_VALUTAZIONE_PSICOLOGICA_FIELDS;
  percorsoFields: FormItem[] = FormConfigs.FORM_PERCORSO_TERAPEUTICO_FIELDS;


  override ngOnInit(): void {
    if (this.pazienteId()) {
      this.loadCartellaClinica(this.pazienteId()!);
    }
  }

  loadCartellaClinica(pazienteId: number) {
    this.isLoading = true;
    forkJoin({
      paziente: this.pazientiService.getById(pazienteId),
      referti: this.refertoService.listaRefertiPaziente(pazienteId),
      percorsi: this.percorsoService.percorsoTerapeuticoPazienteAndMedico(pazienteId),
      valutazioni: this.valutazioniService.valutazioniPsicologichePazienteAndMedico(pazienteId),
      allegati: this.allegatoService.getByPazienteId(pazienteId)
    }).subscribe({
      next: ({ paziente, referti, percorsi, valutazioni, allegati }) => {
        this.paziente.set(paziente.data);
        this.referti.set(referti.data);
        this.percorsi.set(percorsi.data);
        this.valutazioni.set(valutazioni.data);
        this.allegati.set(allegati.data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore durante il caricamento della cartella clinica:', error);
        this.isLoading = false;
      }
    });
  }

  getAllegatiPerPrenotazione(prenotazioneId: number): Allegato[] {
    return this.allegati().filter(a => a.prenotazione?.id === prenotazioneId);
  }

  getIconaAllegato(tipoFile: string): string {
    if (tipoFile === 'PDF') return 'picture_as_pdf';
    if (['JPG', 'JPEG', 'PNG'].includes(tipoFile)) return 'image';
    return 'attach_file';
  }

  selezionaReferto(referto: Referto): void {
    this.refertoSelezionato.set(this.refertoSelezionato()?.id === referto.id ? null : referto);
  }

  toggleReferto(referto: Referto): void {
    this.refertoSelezionato.set(this.refertoSelezionato()?.id === referto.id ? null : referto);
  }

  toggleValutazione(v: ValutazionePsicologica): void {
    this.valutazioneSelezionata.set(this.valutazioneSelezionata()?.id === v.id ? null : v);
  }

  togglePercorso(p: PercorsoTerapeutico): void {
    this.percorsoSelezionato.set(this.percorsoSelezionato()?.id === p.id ? null : p);
  }

  getProgressoPercorso(p: PercorsoTerapeutico): number {
    if (!p.numeroSedutePreviste || p.numeroSedutePreviste === 0) return 0;
    return Math.round(((p.numeroSeduteEffettuate ?? 0) / p.numeroSedutePreviste) * 100);
  }

  async exportPdf(): Promise<void> {
    // console.log('exportPdf chiamato, isExporting:', this.isExporting());
    // if (this.isExporting()) return;
    // this.isExporting.set(true);
    // try {
    //   const html2canvas = (await import('html2canvas')).default;
    //   const jsPDF = (await import('jspdf')).default;

    //   const element = document.querySelector('.cartella-pdf-content') as HTMLElement;
    //   console.log('element trovato:', element);
    //   if (!element) {
    //     console.error('Elemento PDF non trovato');
    //     return;
    //   }

    //   const canvas = await html2canvas(element, {
    //     scale: 2,
    //     useCORS: true,
    //     backgroundColor: '#f8f6f1',
    //     logging: false,
    //     ignoreElements: (el) => {
    //       // Ignora elementi Material che causano problemi
    //       return el.tagName?.toLowerCase().startsWith('mat-');
    //     },
    //     onclone: (clonedDoc) => {
    //       const allElements = clonedDoc.querySelectorAll<HTMLElement>('*');
    //       allElements.forEach(el => {
    //         try {
    //           const computed = window.getComputedStyle(el);
    //           if (computed.color?.includes('color(') ||
    //             computed.backgroundColor?.includes('color(')) {
    //             el.style.color = '#000000';
    //             el.style.backgroundColor = 'transparent';
    //           }
    //         } catch { /* ignora */ }
    //       });
    //     }
    //   });
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('p', 'mm', 'a4');
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = pdf.internal.pageSize.getHeight();
    //   const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    //   let heightLeft = imgHeight;
    //   let position = 0;

    //   pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    //   heightLeft -= pdfHeight;

    //   while (heightLeft > 0) {
    //     position -= pdfHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    //     heightLeft -= pdfHeight;
    //   }

    //   const nome = this.paziente()
    //     ? `${this.paziente()!.cognome}_${this.paziente()!.nome}`
    //     : 'cartella';
    //   pdf.save(`CartellaClinaca_${nome}_${new Date().toISOString().split('T')[0]}.pdf`);
    //   this.snackBar.openSnackBar('PDF scaricato con successo', 'Chiudi');

    // } catch (err) {
    //   console.error('Errore PDF:', err);
    //   this.snackBar.openSnackBar('Errore durante la generazione del PDF', 'Chiudi');
    // } finally {
    //   this.isExporting.set(false);
    // }
  }

  getInitials(paziente: Paziente | null): string {
    if (!paziente) return '?';
    return `${paziente.nome?.charAt(0) ?? ''}${paziente.cognome?.charAt(0) ?? ''}`.toUpperCase();
  }

  getEta(dataNascita: Date): number {
    if (!dataNascita) return 0;
    const oggi = new Date();
    const nascita = new Date(dataNascita);
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const m = oggi.getMonth() - nascita.getMonth();
    if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) eta--;
    return eta;
  }

  getStatoClass(stato: string): string {
    const s = stato?.toLowerCase() ?? '';
    if (s.includes('complet')) return 'chip-completata';
    if (s.includes('conferm')) return 'chip-confermata';
    if (s.includes('attesa')) return 'chip-attesa';
    if (s.includes('annull') || s.includes('cancel')) return 'chip-annullata';
    return '';
  }

  getStatoPercorsoClass(stato: string): string {
    switch (stato) {
      case 'ATTIVO': return 'stato-attivo';
      case 'CONCLUSO': return 'stato-concluso';
      case 'SOSPESO': return 'stato-sospeso';
      default: return '';
    }
  }

  apriPrenotazione(prenotazioneId: number): void {
    this.router.navigate(['/prenotazioni', prenotazioneId]);
  }

  creaNuovoPercorsoTerapeutico(): void {
    const route = RoutesEnum.PAZIENTE + `/${this.paziente()?.id}/percorsi/nuovo`;

    this.router.navigate([route]);
  }

  creaNuovaValutazionePsicologica(): void {
    const route = RoutesEnum.PAZIENTE + `/${this.paziente()?.id}/valutazioni/nuova`;
    this.router.navigate([route]);
  }

  tornaIndietro(): void {
    this.location.back();
  }

  scaricaAllegato(allegato: Allegato): void {
    this.allegatoService.downloadAllegato(allegato.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = allegato.nomeFile || `allegato-${allegato.id}`;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();

        this.snackBar.openSnackBar('Download avviato', 'Chiudi');
      },
      error: (err) => {
        console.error('Errore durante il download:', err);
        this.snackBar.openSnackBar('Errore nel download del file', 'Chiudi');
      }
    });
  }
}
