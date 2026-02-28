import { Component, inject } from '@angular/core';
import { RefertoFiltri } from '../../models/referto-filtri.model';
import { ListBasePage } from '../../shared/components/base/list-base-page.component';
import { RefertoService } from '../../services/referto.service';
import { Referto } from '../../models/referto.model';
import { RefertoTableColumn } from '../../shared/constants/referto-table-column.constant';
import { Column } from '../../shared/models/column.model';
import { FormConfigs } from '../../shared/constants/form-config.constant';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenericCardComponent } from '../../shared/components/generic-card/generic-card.component';
import { GenericFormComponent } from '../../shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-lista-referti',
  imports: [
    SharedModule,
    LoaderComponent,
    GenericFormComponent,
    GenericTableComponent,
    GenericCardComponent,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './lista-referti.component.html',
  styleUrl: './lista-referti.component.scss'
})
export class ListaRefertiComponent extends ListBasePage<RefertoFiltri> {

  readonly refertoService = inject(RefertoService);

  title = 'Referti';
  refertiCaricati: Referto[] = [];
  columns: Column[] = RefertoTableColumn;

  constructor() {
    super();
    this.formItems = FormConfigs.FORM_REFERTO_SEARCH_FIELDS;
  }
  private readonly fieldMap: { key: keyof RefertoFiltri; operator: string }[] = [
    { key: 'nomeMedico', operator: 'IS_LIKE' },
    { key: 'tipoReferto', operator: 'IS_LIKE' }
  ];

  override goNextPage(): void {
    this.refertoService.goNextPage(this.data.next).subscribe(res => this.data = res.data);
  }

  override goPreviousPage(): void {
    this.refertoService.goPreviousPage(this.data.previous).subscribe(res => this.data = res.data);
  }

  override executeSearch(pageSize?: number, filter?: RefertoFiltri | undefined): void {
    this.refertoService.searchAdvanced(
      { ...filter, page_size: pageSize ?? 10 },
      this.fieldMap
    ).subscribe(res => {
      this.data = res.data;
      this.refertiCaricati = res.data.results;
    });
  }

  tornaIndietro(): void {
    this.location.back();
  }

}
