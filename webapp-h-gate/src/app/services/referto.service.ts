import { Injectable, Injector } from '@angular/core';
import { Referto, RefertoCreate } from '../models/referto.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefertoService extends HttpBaseService<Referto> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.referto);
  }

  create(model: RefertoCreate): Observable<ResponseDTO<Referto>> {
    return this.request<ResponseDTO<Referto>>('', METHODS.POST, model);
  }

  listaRefertiPaziente(pazienteId: number): Observable<ResponseDTO<Referto[]>> {
    return this.request<ResponseDTO<Referto[]>>(`/${pazienteId}/all`, METHODS.GET);
  }
}
