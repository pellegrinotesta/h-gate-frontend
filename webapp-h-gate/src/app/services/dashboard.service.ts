import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpRequestBaseService } from '../shared/services/base/http-request-base.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends HttpRequestBaseService {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.paziente);
  }
}
