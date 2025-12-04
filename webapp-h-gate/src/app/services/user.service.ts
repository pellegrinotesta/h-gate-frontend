import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environment/environment";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);
    private baseUrl = environment.endpoints.user;
}

