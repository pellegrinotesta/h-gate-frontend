import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { METHODS } from '../shared/enums/methods.enum';
import { ResponseDTO } from '../shared/models/response.model';
import { AccessoPaziente, StatoConsenso } from '../models/privacy.model';

/** Consensi privacy dei minori e accessi ai loro dati (lato tutore). */
@Injectable({ providedIn: 'root' })
export class PrivacyService extends HttpBaseService<{ id?: number }> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.consensi);
  }

  miei(): Observable<ResponseDTO<StatoConsenso[]>> {
    return this.request<ResponseDTO<StatoConsenso[]>>('/miei', METHODS.GET);
  }

  stato(pazienteId: number): Observable<ResponseDTO<StatoConsenso>> {
    return this.request<ResponseDTO<StatoConsenso>>(`/paziente/${pazienteId}`, METHODS.GET);
  }

  concedi(pazienteId: number): Observable<ResponseDTO<StatoConsenso>> {
    return this.request<ResponseDTO<StatoConsenso>>(`/paziente/${pazienteId}/concedi`, METHODS.POST, {});
  }

  revoca(pazienteId: number, motivo: string): Observable<ResponseDTO<StatoConsenso>> {
    return this.request<ResponseDTO<StatoConsenso>>(`/paziente/${pazienteId}/revoca`, METHODS.POST, { motivo });
  }

  accessi(pazienteId: number): Observable<ResponseDTO<AccessoPaziente[]>> {
    return this.request<ResponseDTO<AccessoPaziente[]>>(`/paziente/${pazienteId}/accessi`, METHODS.GET);
  }
}
