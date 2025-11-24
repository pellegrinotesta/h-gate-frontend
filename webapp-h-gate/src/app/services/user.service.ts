import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { ResponseDTO } from "../shared/models/response.model";
import { AuthenticatedUser } from "../models/authenticated-user.model";
import { User } from "../models/user.model";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);
    private baseUrl = environment.endpoints.user;

    getAuthenticatedUser(): AuthenticatedUser | null {
        const token = localStorage.getItem('adisurc_token');
        if (!token) return null;
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
    }
    
    getActiveUserInfo(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/me`);
    }

    editUser(user: User): Observable<ResponseDTO<User>> {
        return this.http.put<ResponseDTO<User>>(`${this.baseUrl}/me`, user);
    }
}

