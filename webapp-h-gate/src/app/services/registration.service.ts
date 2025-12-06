import { Injectable, Injector } from '@angular/core';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../shared/models/response.model';
import { User } from '../models/user.model';
import { METHODS } from '../shared/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends HttpBaseService<any> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.registration);
  }

  register(data: any): Observable<ResponseDTO<User>> {
    return this.request<ResponseDTO<User>>('', METHODS.POST, data);
  }
}
