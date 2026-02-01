import { Injectable, Injector } from '@angular/core';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { Prenotazione, PrenotazioneCreate, SlotDisponibili } from '../models/prenotazione.model';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService extends HttpBaseService<Prenotazione> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.prenotazione);
  }

  creaPrenotazione(data: PrenotazioneCreate): Observable<ResponseDTO<Prenotazione>> {
    return this.request<ResponseDTO<Prenotazione>>('', METHODS.POST, data);
  }

  annullaPrenotazione(id: number, motivo: string): Observable<ResponseDTO<Prenotazione>> {
    return this.request<ResponseDTO<Prenotazione>>(`/${id}`, METHODS.PUT, { motivo });
  }

  getSlotDisponibili(medicoId: number, data: string): Observable<ResponseDTO<SlotDisponibili>> {
    return this.request<ResponseDTO<SlotDisponibili>>(`/disponibilita/${medicoId}?data=${data}`, METHODS.GET, { data });
  }

  getPrenotazioniTutore(): Observable<ResponseDTO<Prenotazione[]>> {
    return this.request<ResponseDTO<Prenotazione[]>>('/mie', METHODS.GET);
  }

  getDettaglioPrenotazione(id: number): Observable<ResponseDTO<Prenotazione>> {
    return this.request<ResponseDTO<Prenotazione>>(`/${id}`, METHODS.GET);
  }
}
