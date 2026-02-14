import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environment/environment";
import { Observable } from "rxjs";
import { ResponseDTO } from "../shared/models/response.model";
import { User } from "../models/user.model";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);
    private baseUrl = environment.endpoints.user;

    getById(): Observable<ResponseDTO<User>> {
        return this.http.get<ResponseDTO<User>>(this.baseUrl + '/me');
    }
}

