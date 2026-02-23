import { Injectable, Injector } from '@angular/core';
import { Paziente } from '../models/paziente.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class PazienteService extends HttpBaseService<Paziente> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.paziente);
  }

   getById(id: number | string): Observable<ResponseDTO<Paziente>> {
        return this.request<ResponseDTO<Paziente>>('/' + id.toString(), METHODS.GET);
    }

  getPazientiByTutore(): Observable<ResponseDTO<Paziente[]>> {
    return this.request<ResponseDTO<Paziente[]>>('/user-id', METHODS.GET);
  }

  updatePazienteInfo(data: Partial<Paziente>): Observable<ResponseDTO<Paziente>> {
    return this.request<ResponseDTO<Paziente>>('/update', METHODS.PUT, data);
  }

  createPaziente(data: Paziente): Observable<ResponseDTO<Paziente>> {
    return this.request<ResponseDTO<Paziente>>(`/add`, METHODS.POST, data);
  }

  deletePaziente(id: number) {
    return this.request(`/delete/${id}`, METHODS.DELETE);
  }
}
