import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { METHODS } from '../shared/enums/methods.enum';
import { ResponseDTO } from '../shared/models/response.model';
import {
  ApprovazioniConteggio,
  MedicoInAttesa,
  RichiestaAssociazione,
  StatoRichiesta
} from '../models/approvazioni.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovazioniService extends HttpBaseService<RichiestaAssociazione> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.approvazioni);
  }

  conteggio(): Observable<ResponseDTO<ApprovazioniConteggio>> {
    return this.request<ResponseDTO<ApprovazioniConteggio>>('/conteggio', METHODS.GET);
  }

  mediciInAttesa(): Observable<ResponseDTO<MedicoInAttesa[]>> {
    return this.request<ResponseDTO<MedicoInAttesa[]>>('/medici', METHODS.GET);
  }

  approvaMedico(medicoId: number): Observable<ResponseDTO<void>> {
    return this.request<ResponseDTO<void>>(`/medici/${medicoId}/approva`, METHODS.PUT, {});
  }

  rifiutaMedico(medicoId: number, motivo: string): Observable<ResponseDTO<void>> {
    return this.request<ResponseDTO<void>>(`/medici/${medicoId}/rifiuta`, METHODS.PUT, { motivo });
  }

  associazioni(stato: StatoRichiesta = 'IN_ATTESA'): Observable<ResponseDTO<RichiestaAssociazione[]>> {
    return this.request<ResponseDTO<RichiestaAssociazione[]>>('/associazioni', METHODS.GET, {}, { stato });
  }

  approvaAssociazione(id: number): Observable<ResponseDTO<void>> {
    return this.request<ResponseDTO<void>>(`/associazioni/${id}/approva`, METHODS.PUT, {});
  }

  rifiutaAssociazione(id: number, motivo: string): Observable<ResponseDTO<void>> {
    return this.request<ResponseDTO<void>>(`/associazioni/${id}/rifiuta`, METHODS.PUT, { motivo });
  }
}
