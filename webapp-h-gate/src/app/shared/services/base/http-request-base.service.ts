import { HttpClient } from "@angular/common/http";
import { Injector } from "@angular/core";
import { Observable, of } from "rxjs";
import { apiUrl } from "../../../../environment/environment";
import { METHODS } from "../../enums/methods.enum";


export abstract class HttpRequestBaseService {

    protected injector: Injector;
    protected readonly httpClient: HttpClient;
    protected readonly baseUrl: string;

    constructor(injector: Injector, baseUrl?: string) {
        this.injector = injector;
        this.httpClient = injector.get(HttpClient);
        this.baseUrl = baseUrl? baseUrl : apiUrl;
    }

    protected request<T>(url: string,
        method: string,
        bodyParams?: Partial<T> | T | {
            [key: string]: any;
        },
        params?: any): Observable<T> {
        switch (method) {
            case METHODS.GET:
                return this.httpClient.get<T>(this.baseUrl + url + this.getParams(params));
            case METHODS.POST:
                return this.httpClient.post<T>(this.baseUrl + url, bodyParams? bodyParams : {});
            case METHODS.PUT:
                return this.httpClient.put<T>(this.baseUrl + url, bodyParams? bodyParams : {});
            case METHODS.PATCH:
                return this.httpClient.patch<T>(this.baseUrl + url, bodyParams? bodyParams : {});
            case METHODS.DELETE:
                return this.httpClient.delete<T>(this.baseUrl + url);
        }
        return of();
    }

    protected getParams(params?: { [key: string]: any; }): string {
        if(!params)
            return ''
        const paramsUrl: string[] = [];
        Object.keys(params).forEach( key => {
            if (params[key] === null || params[key] === undefined || params[key] === '')
                return
            paramsUrl.push( key + '=' + params[key] )
        });
        return '?' + paramsUrl.join('&');
    }

}