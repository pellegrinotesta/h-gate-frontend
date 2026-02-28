import { Injectable, Injector } from '@angular/core';
import { Allegato } from '../models/allegato.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { ResponseDTO } from '../shared/models/response.model';
import { Observable } from 'rxjs/internal/Observable';
import { METHODS } from '../shared/enums/methods.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllegatoService extends HttpBaseService<Allegato> {

  constructor(injector: Injector, private readonly http: HttpClient) {
    super(injector, environment.endpoints.allegato);
  }

  uploadAllegati(prenotazioneId: number, formData: FormData): Observable<ResponseDTO<Allegato[]>> {
    return this.request<ResponseDTO<Allegato[]>>(`/prenotazione/${prenotazioneId}`, METHODS.POST, formData);
  }

  getByPrenotazioneId(prenotazioneId: number): Observable<ResponseDTO<Allegato[]>> {
    return this.request<ResponseDTO<Allegato[]>>(`/prenotazione/${prenotazioneId}`, METHODS.GET);
  }

  getByPazienteId(pazienteId: number): Observable<ResponseDTO<Allegato[]>> {
    return this.request<ResponseDTO<Allegato[]>>(`/paziente/${pazienteId}`, METHODS.GET);
  }

  downloadAllegato(allegatoId: number): Observable<Blob> {
    const url = `${this.baseUrl}/${allegatoId}/download`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
}
