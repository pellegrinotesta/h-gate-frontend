import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { ResponseDTO } from '../shared/models/response.model';
import { AgendaMedico } from '../models/agenda-medico.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends HttpBaseService<AgendaMedico> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.agenda);
  }
  getPrenotazioniMedico(): Observable<ResponseDTO<AgendaMedico[]>> {
    return this.request<ResponseDTO<AgendaMedico[]>>('', METHODS.GET);
  }


}
