import { Injector } from "@angular/core";
import { Observable } from "rxjs";
import { HttpRequestBaseService } from "./http-request-base.service";
import { PaginatedResponseDTO, ResponseDTO } from "../../models/response.model";
import { METHODS } from "../../enums/methods.enum";


export abstract class HttpBaseService<M> extends HttpRequestBaseService {

    constructor(injector: Injector, baseUrl?: string) {
        super(injector, baseUrl)
    }

    get(id: number | string): Observable<M> {
        return this.request<M>(`/${id.toString()}`, METHODS.GET);
    }
    getAll(params?: any): Observable<M[]> {
        return this.request<M[]>(``, METHODS.GET, {}, params);
    }
    save(model: Partial<M>): Observable<M> {
        return this.request<M>(``, METHODS.POST, model);
    }
    saveAll(model: M[]): Observable<ResponseDTO<M[]>> {
        return this.request<ResponseDTO<M[]>>(`/`, METHODS.POST, model);
    }
    update(id: number | string, model: Partial<M>): Observable<ResponseDTO<M>> {
        return this.request<ResponseDTO<M>>(`/${id.toString()}/`, METHODS.PUT, model);
    }
    patch(id: number | string, model: Partial<M>): Observable<ResponseDTO<M>> {
        return this.request<ResponseDTO<M>>(`/${id.toString()}/`, METHODS.PATCH, model);
    }
    delete(id: number | string): Observable<ResponseDTO<M> | void> {
        return this.request<ResponseDTO<M>>(`/${id.toString()}/`, METHODS.DELETE);
    }
    searchAdvanced(params?: any): Observable<PaginatedResponseDTO<M[]>> {
        return this.request<PaginatedResponseDTO<M[]>>(`/search-advanced/`, METHODS.GET, {}, params);
    }
    goNextPage(url: string): Observable<PaginatedResponseDTO<M[]>> {
        return this.httpClient.get<PaginatedResponseDTO<M[]>>(url);
    }
    goPreviousPage(url: string): Observable<PaginatedResponseDTO<M[]>> {
        return this.httpClient.get<PaginatedResponseDTO<M[]>>(url);
    }

}