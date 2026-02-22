import { Component, inject, input } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { ListBasePage } from '../../shared/components/base/list-base-page.component';
import { PrenotazioneFiltri } from '../../models/prenotazione-filtri.model';
import { Column } from '../../shared/models/column.model';
import { PrenotazioneTableColumn } from '../../shared/constants/prenotazione-table-column.constant';
import { TableAction } from '../../shared/models/table-action.model';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { PrenotazioneDettagliata } from '../../models/prenotazione-dettagliata.model';
import { TableOperation } from '../../shared/models/table-operation.model';
import { RoutesEnum } from '../../shared/enums/routes.enum';
import { SNACKBAR } from '../../shared/enums/snackbar-class.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrenotazioniAction } from '../../shared/constants/prenotazioni-table-action.constant';


@Component({
  selector: 'app-prenotazioni-list',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericFormComponent,
    GenericTableComponent,
    GenericCardComponent,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './prenotazioni-list.component.html',
  styleUrl: './prenotazioni-list.component.scss'
})
export class PrenotazioniListComponent extends ListBasePage<PrenotazioneFiltri> {

  readonly matDialog = inject(MatDialog);
  readonly prenotazioneService = inject(PrenotazioneService);

  title = 'Prenotazioni';

  columns: Column[] = PrenotazioneTableColumn;
  actions: TableAction[] = PrenotazioniAction;

  constructor() {
    super();
    this.formItems = [
      { name: 'numeroPrenotazione', label: 'Numero Prenotazione', type: 'text', initialValue: '' },
      { name: 'tipoVisita', label: 'Tipo visita', type: 'text', initialValue: '' },
      { name: 'stato', label: 'Stato', type: 'text', initialValue: '' },
      { name: 'pazienteNomeCompleto', label: 'Paziente', type: 'text', initialValue: '' },
      { name: 'tutoreNomeCompleto', label: 'Tutore', type: 'text', initialValue: '' },
      { name: 'medicoNomeCompleto', label: 'Medico', type: 'text', initialValue: '' },
    ]
  }

  addNew(): void {
    this.router.navigate([RoutesEnum.PRENOTAZIONI, 'nuova']);
  }

  onActionClick(ev: { action: TableAction, element: PrenotazioneDettagliata }): void {
    switch (ev.action.operation) {
      case TableOperation.VIEW:
        this.router.navigate([RoutesEnum.PRENOTAZIONI, ev.element.id]);
        break;
      // case TableOperation.EDIT:
      //   this.router.navigate([RoutesEnum.PRENOTAZIONI, ev.element.id]);
      //   break;
      // case TableOperation.UPDATE:
      //   this.router.navigate([RoutesEnum.PRENOTAZIONI, this.prenotazioneId(), ev.element, ev.element.id]);
      //   break;
      case TableOperation.DELETE:
        this.onDeletePrenotazione(ev.element);
        break;
      default: this.snackBar.openSnackBar('Operazione non disponibile', 'Chiudi', SNACKBAR.WARN);
    }
  }

  onDeletePrenotazione(element: PrenotazioneDettagliata): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        message: `Sei sicuro di voler eliminare la prenotazione ${element.numeroPrenotazione}?`,
        subtitle: 'L\'operazione non può essere annullata.'
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.prenotazioneService.delete(element.id).subscribe(res => {
          this.executeSearch(this.size, this.currentFilter);
        });
      }
    });
  }

  override goNextPage(): void {
    this.prenotazioneService.goNextPage(this.data.next).subscribe(res => this.data = res.data);
  }

  override goPreviousPage(): void {
    this.prenotazioneService.goPreviousPage(this.data.previous).subscribe(res => this.data = res.data);
  }

  private readonly fieldMap: { key: keyof PrenotazioneFiltri; operator: string }[] = [
    { key: 'numeroPrenotazione', operator: 'IS_LIKE' },
    { key: 'tipoVisita', operator: 'IS_LIKE' },
    { key: 'stato', operator: 'EQUALS' },
    { key: 'pazienteNomeCompleto', operator: 'IS_LIKE' },
    { key: 'tutoreNomeCompleto', operator: 'IS_LIKE' },
    { key: 'medicoNomeCompleto', operator: 'IS_LIKE' },
  ];

  override executeSearch(pageSize?: number, filter?: PrenotazioneFiltri): void {
    this.prenotazioneService.searchAdvanced(
      { ...filter, page_size: pageSize ?? 10 },
      this.fieldMap
    ).subscribe(res => this.data = res.data);
  }

}
