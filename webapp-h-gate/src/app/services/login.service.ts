import { Injectable, Injector } from '@angular/core';
import { HttpBaseService } from '../shared/services/base/http-base.service';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { environment } from '../../environment/environment';
import { AuthRequest } from '../models/auth-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpBaseService<AuthenticatedUser> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.auth)
  }

  login(credentials: AuthRequest): Observable<AuthenticatedUser> {
    return this.httpClient.post<AuthenticatedUser>(this.baseUrl, credentials);
  }
}
