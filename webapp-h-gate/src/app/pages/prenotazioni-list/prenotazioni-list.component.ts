import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoaderComponent } from '../../components/loader/loader.component';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { AdvancedSearchBasePageComponent } from '../../shared/components/base/advanced-search-base-page.component';
import { PrenotazioneDettagliata } from '../../models/prenotazione-dettagliata.model';
import { PageResponse } from '../../shared/models/page-response.model';
import { Observable } from 'rxjs';
import { EmptyObject } from '../../shared/base/authentication/types/empty-object.type';
import { AdvancedSearchCriteria } from '../../shared/models/advanced-search/advanced-search-criteria.model';
import { AdvancedSearchSimpleCriteria } from '../../shared/models/advanced-search/advanced-search-simple-criteria.model';
import { PagingAndSortingCriteria } from '../../shared/models/advanced-search/paging-and-sorting-criteria.model';

@Component({
  selector: 'app-prenotazioni-list',
  imports: [
    SharedModule,
    LoaderComponent
  ],
  templateUrl: './prenotazioni-list.component.html',
  styleUrl: './prenotazioni-list.component.scss'
})
export class PrenotazioniListComponent extends AdvancedSearchBasePageComponent<PageResponse<PrenotazioneDettagliata>> {

  readonly prenotazioneService = inject(PrenotazioneService);

  protected override search(criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria, sortCriteria?: PagingAndSortingCriteria): Observable<PageResponse<PrenotazioneDettagliata>> {
    throw new Error('Method not implemented.');
  }
  protected override defineSearchCriteria(): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria | EmptyObject {
    throw new Error('Method not implemented.');
  }
  protected override defineSortCriteria(): string | { [key: string]: 'asc' | 'desc'; } {
    throw new Error('Method not implemented.');
  }

  
}
