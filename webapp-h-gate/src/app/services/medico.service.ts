import { Injectable, Injector } from '@angular/core';
import { Medico } from '../models/medico.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends HttpBaseService<Medico> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.profile);
  }

  findMedicoByUserId(): Observable<ResponseDTO<Medico>> {
    return this.request<ResponseDTO<Medico>>('', METHODS.GET);
  }
}
