import { Injectable, Injector } from '@angular/core';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { TariffeMedico } from '../models/tariffe-medico.model';
import { environment } from '../../environment/environment.prod';
import { METHODS } from '../shared/enums/methods.enum';
import { ResponseDTO } from '../shared/models/response.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TariffeMediciService extends HttpBaseService<TariffeMedico> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.tariffe);
  }


  getMie(): Observable<ResponseDTO<TariffeMedico[]>> {
    return this.request<ResponseDTO<TariffeMedico[]>>('/mie', METHODS.GET);
  }

  create(dto: Partial<TariffeMedico>): Observable<ResponseDTO<TariffeMedico>> {
    return this.request<ResponseDTO<TariffeMedico>>('', METHODS.POST, dto);
  }

  updateTariffe(id: number, dto: Partial<TariffeMedico>): Observable<ResponseDTO<TariffeMedico>> {
    return this.request<ResponseDTO<TariffeMedico>>(`/${id}`, METHODS.PUT, dto);
  }

  deleteTariffe(id: number): Observable<void> {
    return this.request<void>(`/${id}`, METHODS.DELETE);
  }

  toggleAttiva(id: number): Observable<ResponseDTO<TariffeMedico>> {
    return this.request<ResponseDTO<TariffeMedico>>(`/${id}/toggle`, METHODS.PATCH);
  }
}
