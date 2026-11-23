import { Injectable, Injector } from '@angular/core';
import { Paziente } from '../models/paziente.model';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { Observable, map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
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

  /**
   * Scarica il PDF ufficiale della cartella clinica, generato dal backend.
   * Il nome del file arriva nell'header Content-Disposition (se esposto), altrimenti se ne usa uno di ripiego.
   */
  downloadCartellaClinica(id: number): Observable<{ blob: Blob; nomeFile: string }> {
    return this.httpClient
      .get(`${this.baseUrl}/${id}/cartella/download`, { responseType: 'blob', observe: 'response' })
      .pipe(map((res: HttpResponse<Blob>) => ({
        blob: res.body as Blob,
        nomeFile: nomeDaContentDisposition(res.headers.get('Content-Disposition')) ?? `Cartella_clinica_${id}.pdf`
      })));
  }
}

/** Estrae il nome del file da Content-Disposition (supporta filename*=UTF-8''... e filename="...") */
function nomeDaContentDisposition(header: string | null): string | null {
  if (!header) return null;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8) {
    try { return decodeURIComponent(utf8[1].trim()); } catch { /* prosegue con filename semplice */ }
  }
  const semplice = /filename="?([^";]+)"?/i.exec(header);
  return semplice ? semplice[1].trim() : null;
}
