import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { SharedModule } from '../../shared/shared.module';
import { ListBasePage } from '../../shared/components/base/list-base-page.component';
import { PazienteFiltri } from '../../models/paziente-filtri.model';
import { PazienteService } from '../../services/paziente.service';
import { Column } from '../../shared/models/column.model';
import { TableAction } from '../../shared/models/table-action.model';
import { PazientiAction } from '../../shared/constants/paziente-table-actions.constant';
import { PazienteTableColumn } from '../../shared/constants/paziente-table-column.constant';
import { Paziente } from '../../models/paziente.model';
import { TableOperation } from '../../shared/models/table-operation.model';
import { RoutesEnum } from '../../shared/enums/routes.enum';
import { SNACKBAR } from '../../shared/enums/snackbar-class.enum';
import { ExcelExportService } from '../../shared/services/excel-export.service';

@Component({
  selector: 'app-lista-pazienti',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericFormComponent,
    GenericTableComponent,
    GenericCardComponent,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './lista-pazienti.component.html',
  styleUrl: './lista-pazienti.component.scss'
})
export class ListaPazientiComponent extends ListBasePage<PazienteFiltri> {

  readonly pazienteService = inject(PazienteService);
  readonly excelService = inject(ExcelExportService);

  title = 'Pazienti';

  columns: Column[] = PazienteTableColumn;
  actions: TableAction[] = PazientiAction;

  private pazientiCaricati: Paziente[] = [];

  constructor() {
    super();
    this.formItems = [
      { name: 'codiceFiscale', label: 'Codice fiscale', type: 'text', initialValue: '' },
      {
        name: 'sesso', label: 'Sesso', type: 'select', initialValue: '', options: [
          { label: 'Maschio', value: 'M' },
          { label: 'Femmina', value: 'F' },
        ]
      },
      { name: 'patologieCroniche', label: 'Patologie croniche', type: 'text', initialValue: '' },
      { name: 'allergie', label: 'Allergie', type: 'text', initialValue: '' },
    ]
  }

  onActionClick(ev: { action: TableAction, element: Paziente }): void {
    switch (ev.action.operation) {
      case TableOperation.VIEW:
        this.router.navigate([RoutesEnum.REFERTO, ev.element.id]);
        break;
      default: this.snackBar.openSnackBar('Operazione non disponibile', 'Chiudi', SNACKBAR.WARN);
    }
  }

  private readonly fieldMap: { key: keyof PazienteFiltri; operator: string }[] = [
    { key: 'codiceFiscale', operator: 'IS_LIKE' },
    { key: 'sesso', operator: 'IS_LIKE' },
    { key: 'allergie', operator: 'IS_LIKE' },
    { key: 'patologieCroniche', operator: 'IS_LIKE' }
  ];

  override goNextPage(): void {
    this.pazienteService.goNextPage(this.data.next).subscribe(res => this.data = res.data);
  }

  override goPreviousPage(): void {
    this.pazienteService.goPreviousPage(this.data.previous).subscribe(res => this.data = res.data);
  }

  override executeSearch(pageSize?: number, filter?: any): void {
    this.pazienteService.searchAdvanced(
      { ...filter, page_size: pageSize ?? 10 },
      this.fieldMap
    ).subscribe(res => {
      this.data = res.data;
      this.pazientiCaricati = res.data.results;
    });
  }

  downloadExcel(): void {
    const data = this.pazientiCaricati.map((p: Paziente) => ({
      nome: p.nome,
      cognome: p.cognome,
      codiceFiscale: p.codiceFiscale,
      citta: p.citta,
      sesso: p.sesso,
      dataNascita: p.dataNascita,
      patologieCroniche: p.patologieCroniche,
      allergie: p.allergie,
      gruppoSanguigno: p.gruppoSanguigno,
      altezzaCm: p.altezzaCm,
      pesoKg: p.pesoKg,
      noteMediche: p.noteMediche,
    }));
    this.excelService.exportToExcel(data, 'pazienti');
  }

}
