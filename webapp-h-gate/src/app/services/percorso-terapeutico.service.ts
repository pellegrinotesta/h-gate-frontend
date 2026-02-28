import { Injectable, Injector } from '@angular/core';
import { PercorsoTerapeutico } from '../models/percorso-terapeutico.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class PercorsoTerapeuticoService extends HttpBaseService<PercorsoTerapeutico> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.percorsoTerapeutico);
  }

  percorsoTerapeuticoPazienteAndMedico(pazienteId: number): Observable<ResponseDTO<PercorsoTerapeutico[]>> {
    return this.request<ResponseDTO<PercorsoTerapeutico[]>>(`/paziente/${pazienteId}`, METHODS.GET);
  }

  getByPaziente(pazienteId: number): Observable<ResponseDTO<PercorsoTerapeutico[]>> {
    return this.request<ResponseDTO<PercorsoTerapeutico[]>>(`/${pazienteId}/paziente`, METHODS.GET);
  }

  crea(dto: Partial<PercorsoTerapeutico>): Observable<ResponseDTO<PercorsoTerapeutico>> {
    return this.request<ResponseDTO<PercorsoTerapeutico>>('', METHODS.POST, dto);
  }

  aggiorna(id: number, dto: Partial<PercorsoTerapeutico>): Observable<ResponseDTO<PercorsoTerapeutico>> {
    return this.request<ResponseDTO<PercorsoTerapeutico>>(`/${id}`, METHODS.PUT, dto);
  }

  elimina(id: number): Observable<void> {
    return this.request<void>(`/${id}`, METHODS.DELETE);
  }
}
