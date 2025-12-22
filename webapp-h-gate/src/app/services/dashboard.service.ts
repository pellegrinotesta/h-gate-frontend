import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpRequestBaseService } from '../shared/services/base/http-request-base.service';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';
import { DashboardPazienteResponse } from '../models/dashboard-paziente-response.model';
import { DashboardMedicoResponse } from '../models/dashboard-medico-response.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService extends HttpRequestBaseService {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.dashboard);
  }

  dashboardPaziente(): Observable<ResponseDTO<DashboardPazienteResponse>> {
    return this.request<ResponseDTO<DashboardPazienteResponse>>('/paziente', METHODS.GET);
  }

  dashboardMedico(): Observable<ResponseDTO<DashboardMedicoResponse>> {
    return this.request<ResponseDTO<DashboardMedicoResponse>>('/medico', METHODS.GET);
  }
}