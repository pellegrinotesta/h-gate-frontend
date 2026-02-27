import { Component, inject } from '@angular/core';
import { ListBasePage } from '../../shared/components/base/list-base-page.component';
import { MedicoFiltri } from '../../models/medico-filtri.model';
import { MedicoService } from '../../services/medico.service';
import { MedicoTableColumn } from '../../shared/constants/medico-table-column.constant';
import { Column } from '../../shared/models/column.model';
import { Medico } from '../../models/medico.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-lista-medici',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericFormComponent,
    GenericTableComponent,
    GenericCardComponent,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './lista-medici.component.html',
  styleUrl: './lista-medici.component.scss'
})
export class ListaMediciComponent extends ListBasePage<MedicoFiltri> {

  readonly medicoService = inject(MedicoService);

  title = 'Cerca medico';
  mediciCaricati: Medico[] = [];

  columns: Column[] = MedicoTableColumn;

  constructor() {
    super();
    this.formItems = FormConfigs.FORM_MED_SEARCH_FIELDS;
  }

  private readonly fieldMap: { key: keyof MedicoFiltri; operator: string }[] = [
    { key: 'nomeCompleto', operator: 'IS_LIKE' },
    { key: 'specializzazione', operator: 'IS_LIKE' },
    { key: 'citta', operator: 'IS_LIKE' },
    { key: 'provincia', operator: 'IS_LIKE' }
  ];

  override goNextPage(): void {
    this.medicoService.goNextPage(this.data.next).subscribe(res => this.data = res.data);
  }
  override goPreviousPage(): void {
    this.medicoService.goPreviousPage(this.data.previous).subscribe(res => this.data = res.data);
  }
  
  override executeSearch(pageSize?: number, filter?: MedicoFiltri | undefined): void {
    this.medicoService.searchAdvanced(
      { ...filter, page_size: pageSize ?? 10 },
      this.fieldMap
    ).subscribe(res => {
      this.data = res.data;
      this.mediciCaricati = res.data.results;
    });
  }

  tornaIndietro(): void {
    this.location.back();
  }

}
