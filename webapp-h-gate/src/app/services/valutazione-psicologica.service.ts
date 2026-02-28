import { Injectable, Injector } from '@angular/core';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { ValutazionePsicologica } from '../models/valutazione-psicologica.model';
import { environment } from '../../environment/environment';
import { ResponseDTO } from '../shared/models/response.model';
import { Observable } from 'rxjs';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class ValutazionePsicologicaService extends HttpBaseService<ValutazionePsicologica> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.valutazioni);
  }

  valutazioniPsicologichePazienteAndMedico(pazienteId: number): Observable<ResponseDTO<ValutazionePsicologica[]>> {
    return this.request<ResponseDTO<ValutazionePsicologica[]>>(`/paziente/${pazienteId}/medico`, METHODS.GET);
  }

  getByPaziente(pazienteId: number): Observable<ResponseDTO<ValutazionePsicologica[]>> {
    return this.request<ResponseDTO<ValutazionePsicologica[]>>(`/paziente/${pazienteId}`, METHODS.GET);
  }

  crea(dto: Partial<ValutazionePsicologica>): Observable<ResponseDTO<ValutazionePsicologica>> {
    return this.request<ResponseDTO<ValutazionePsicologica>>('', METHODS.POST, dto);
  }

  aggiorna(id: number, dto: Partial<ValutazionePsicologica>): Observable<ResponseDTO<ValutazionePsicologica>> {
    return this.request<ResponseDTO<ValutazionePsicologica>>(`/${id}`, METHODS.PUT, dto);
  }

  elimina(id: number): Observable<void> {
    return this.request<void>(`/${id}`, METHODS.DELETE);
  }
}
