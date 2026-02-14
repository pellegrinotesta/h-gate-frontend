import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpRequestBaseService } from '../shared/services/base/http-request-base.service';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';
import { DashboardPazienteResponse } from '../models/dashboard-paziente-response.model';
import { DashboardMedicoResponse } from '../models/dashboard-medico-response.model';
import { DashboardAdminResponse, MedicoDaVerificare } from '../models/dashboard-admin-response.model';
import { KpiData } from '../models/kpi-data.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService extends HttpRequestBaseService {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.dashboard);
  }

  dashboardPaziente(): Observable<ResponseDTO<DashboardPazienteResponse>> {
    return this.request<ResponseDTO<DashboardPazienteResponse>>('/tutore', METHODS.GET);
  }

  dashboardMedico(): Observable<ResponseDTO<DashboardMedicoResponse>> {
    return this.request<ResponseDTO<DashboardMedicoResponse>>('/medico', METHODS.GET);
  }

  dashboardAdmin(): Observable<ResponseDTO<DashboardAdminResponse>> {
    return this.request<ResponseDTO<DashboardAdminResponse>>('/admin', METHODS.GET);
  }

  getKpiData(): Observable<ResponseDTO<KpiData>> {
    return this.request<ResponseDTO<KpiData>>(`/kpi`, METHODS.GET);
  }

  /**
   * Recupera dashboard completa
   */
  getDashboardCompleta(): Observable<ResponseDTO<DashboardAdminResponse>> {
    return this.request<ResponseDTO<DashboardAdminResponse>>('', METHODS.GET)
  }

  /**
   * Recupera medici da verificare
   */
  getMediciDaVerificare(): Observable<ResponseDTO<MedicoDaVerificare[]>> {
    return this.request<ResponseDTO<MedicoDaVerificare[]>>(`/medici-da-verificare`, METHODS.GET);
  }

  /**
   * Approva un medico
   */
  approvaMedico(medicoId: number): void{
      this.request<ResponseDTO<void>>(`/medici/${medicoId}/approva`,METHODS.POST)
  }

  /**
   * Rifiuta un medico
   */
  async rifiutaMedico(medicoId: number, motivo: string) {
    this.request<ResponseDTO<void>>(`/medici/${medicoId}/rifiuta`, METHODS.POST, { motivo });
  }
}