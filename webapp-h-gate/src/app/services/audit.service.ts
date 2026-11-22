import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { METHODS } from '../shared/enums/methods.enum';
import { ResponseDTO } from '../shared/models/response.model';
import { AuditRiga, FiltriAudit, Pagina } from '../models/privacy.model';

/** Registro accessi (solo amministratori, sola lettura). */
@Injectable({ providedIn: 'root' })
export class AuditService extends HttpBaseService<AuditRiga> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.audit);
  }

  cerca(filtri: FiltriAudit, page: number, size: number): Observable<ResponseDTO<Pagina<AuditRiga>>> {
    const params: Record<string, string | number> = { page, size };
    Object.entries(filtri).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        params[k] = encodeURIComponent(String(v).trim());
      }
    });
    return this.request<ResponseDTO<Pagina<AuditRiga>>>('', METHODS.GET, {}, params);
  }
}
