import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpRequestBaseService } from '../shared/services/base/http-request-base.service';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { METHODS } from '../shared/enums/methods.enum';
import { DashboardResponse } from '../models/dashboard-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends HttpRequestBaseService {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.dashboard);
  }

  dashboardPaziente(): Observable<ResponseDTO<DashboardResponse>> {
    return this.request<ResponseDTO<DashboardResponse>>('/paziente', METHODS.GET);
  }
}
