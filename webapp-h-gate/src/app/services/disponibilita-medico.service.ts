import { Injectable, Injector } from '@angular/core';
import { DisponibilitaMedico } from '../models/disponibilita-medico.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class DisponibilitaMedicoService extends HttpBaseService<DisponibilitaMedico> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.disponibilita);
  }

  getDisponibilita(medicoId: number): Observable<ResponseDTO<DisponibilitaMedico[]>> {
    return this.request<ResponseDTO<DisponibilitaMedico[]>>(`/${medicoId}`, METHODS.GET);
  }

  salvaDisponibilita(data: DisponibilitaMedico): Observable<ResponseDTO<DisponibilitaMedico>> {
    return this.request<ResponseDTO<DisponibilitaMedico>>('', METHODS.POST, data);
  }

  abilitaGiorno(giornoSettimana: number): Observable<ResponseDTO<string>> {
    return this.request<ResponseDTO<string>>(`/${giornoSettimana}/abilitaGiorno`, METHODS.PUT);
  }

  disabilitaGiorno(giornoSettimana: number): Observable<ResponseDTO<string>> {
    return this.request<ResponseDTO<string>>(`/${giornoSettimana}/disabilita`, METHODS.PUT);
  }

  eliminaDisponibilita(giornoSettimana: number): Observable<ResponseDTO<string>> {
    return this.request<ResponseDTO<string>>(`/${giornoSettimana}`, METHODS.DELETE);
  }

  configuraStandard(): Observable<ResponseDTO<DisponibilitaMedico[]>> {
    return this.request<ResponseDTO<DisponibilitaMedico[]>>('/standard', METHODS.PUT);
  }


}
