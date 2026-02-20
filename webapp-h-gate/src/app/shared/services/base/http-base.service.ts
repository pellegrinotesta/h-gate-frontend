import { Injector } from "@angular/core";
import { Observable } from "rxjs";
import { HttpRequestBaseService } from "./http-request-base.service";
import { METHODS } from "../../enums/methods.enum";
import { BaseModel } from "../../models/base-model";
import { AdvancedSearchCriteria } from "../../models/advanced-search/advanced-search-criteria.model";
import { AdvancedSearchSimpleCriteria } from "../../models/advanced-search/advanced-search-simple-criteria.model";
import { PaginatedResponseDTO } from "../../models/response.model";
import { PrenotazioneFiltri } from "../../../models/prenotazione-filtri.model";
import { HttpParams } from "@angular/common/http";


export abstract class HttpBaseService<M extends BaseModel> extends HttpRequestBaseService {

    constructor(injector: Injector, baseUrl?: string) {
        super(injector, baseUrl)
    }

    get(id: number | string): Observable<M> {
        return this.request<M>(id.toString(), METHODS.GET);
    }
    getAll(params?: any): Observable<M[]> {
        return this.request<M[]>('', METHODS.GET, {}, params);
    }
    save(model: M): Observable<M> {
        return this.request<M>('', METHODS.POST, model);
    }
    saveAll(model: M[]): Observable<M[]> {
        return this.request<M[]>('', METHODS.POST, model);
    }
    update(id: number | string, model: M): Observable<M> {
        return this.request<M>('/' + id.toString(), METHODS.PUT, model);
    }
    patch(id: number | string, model: Partial<M>): Observable<M> {
        return this.request<M>(id.toString(), METHODS.PATCH, model);
    }
    delete(id: number | string): Observable<M | void> {
        return this.request<M>(id.toString(), METHODS.DELETE);
    }
    find<S>(criteria?: { [key: string]: any; }): Observable<S> {
        return this.request<S>('search', METHODS.POST, criteria);
    }

    advancedSearch<S>(criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria, params?: {
        [key: string]: any;
    }): Observable<S> {
        let finalUrl = 'advanced-search' + this.getParams(params);
        return this.request<S>(finalUrl, METHODS.POST, criteria)
    }

    searchAdvanced<F extends Record<string, any>>(
        filtri: F & { page_size?: number },
        fieldMap: { key: keyof F; operator: string }[]
    ): Observable<PaginatedResponseDTO<M[]>> {

        const activeCriteria = fieldMap.find(({ key }) => {
            const value = filtri[key];
            return value !== null && value !== undefined && value !== '';
        });

        const body = activeCriteria
            ? { field: activeCriteria.key, operator: activeCriteria.operator, value: filtri[activeCriteria.key] }
            : null;

        const params = { page_size: filtri.page_size ?? 20 };

        return this.request<PaginatedResponseDTO<M[]>>(
            '/advanced-search' + this.getParams(params),
            METHODS.POST,
            body ?? {}
        );
    }

    goNextPage(url: string): Observable<PaginatedResponseDTO<M[]>> {
        return this.httpClient.get<PaginatedResponseDTO<M[]>>(url);
    }

    goPreviousPage(url: string): Observable<PaginatedResponseDTO<M[]>> {
        return this.httpClient.get<PaginatedResponseDTO<M[]>>(url);
    }

}