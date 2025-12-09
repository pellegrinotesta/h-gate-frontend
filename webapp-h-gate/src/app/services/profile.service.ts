import { Injectable, Injector } from '@angular/core';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { User } from '../models/user.model';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { METHODS } from '../shared/enums/methods.enum';
import { ResponseDTO } from '../shared/models/response.model';
import { PatchProfile } from '../models/patch-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends HttpBaseService<User> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.profile);
  }

  override get(): Observable<User> {
    return this.request<User>('', METHODS.GET);
  }

  updateGeneralInfo(data: Partial<User>): Observable<ResponseDTO<User>> {
    return this.request<ResponseDTO<User>>('/update', METHODS.PUT, data);
  }

  partialUpdate(data: PatchProfile): Observable<ResponseDTO<User>> {
    return this.request<ResponseDTO<User>>('', METHODS.PATCH, data);
  }

}
