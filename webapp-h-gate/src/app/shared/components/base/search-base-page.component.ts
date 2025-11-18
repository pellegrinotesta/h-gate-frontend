import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, takeUntil } from "rxjs";
import { PagingAndSortingCriteria } from "../../base/models/paging-and-sorting-criteria.model";
import { BasePageComponent } from "./base-page.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: 'app-base-page',
    standalone: true,
    template: `
      <p>
        base works!
      </p>
    `
  })
export abstract class SearchBasePageComponent<M> extends BasePageComponent implements OnInit {

    protected abstract search(criteria?: {
        [key: string]: any;
    }, sortCriteria?: PagingAndSortingCriteria): Observable<M>;
    /**
     * Restituisce i criteri di ricerca
     */
    protected abstract defineSearchCriteria(): {
        [key: string]: any;
    };
    /**
     * Restituisce i criteri di ordinamento
     */
    protected abstract defineSortCriteria(): string | {
        [key: string]: 'asc' | 'desc';
    };

    private sortFieldActive: any;
    private _sortDirection: 'asc' | 'desc';
    private _pageNumber;
    private _pageSize;
    private _loading: boolean = false;
    
    dataSource!: MatTableDataSource<M>;
    searchInput: string = '';
    searchResult: M | undefined;
    startSearchOnInit: boolean;
    pageable: PagingAndSortingCriteria = { page: 0, size: 50 };
    totalElements!: number;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor() {
        super();
        this._sortDirection = 'asc';
        this._pageNumber = 0;
        this._pageSize = 20;
        this.startSearchOnInit = true;
        this.dataSource = new MatTableDataSource();
    }

    override ngOnInit() {
        super.ngOnInit();
        if (this.startSearchOnInit) {
            this.loader.show();
            this.executeSearch();
        }
    }

    get pageNumber(): number {
        return this._pageNumber;
    }

    set pageNumber(page: number) {
        this._pageNumber = page;
        this.executeSearch();
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(size: number) {
        this._pageSize = size;
        this.executeSearch();
    }

    get sortDirection(): 'asc' | 'desc' {
        return this._sortDirection;
    }

    set sortDirection(direction: 'asc' | 'desc') {
        this._sortDirection = direction;
        this.executeSearch();
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(loading: boolean) {
        this._loading = loading;
    }

    /**
     * Esegue una nuova ricerca imposta l'ordinamento in base alla field e direction in ingresso
     * @param field
     * @param direction
     */
    changeSort(field: string, direction: 'asc' | 'desc'): void {
        this.sortFieldActive = { [field]: direction };
        this.executeSearch();
    }

    changePageSize(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.loading = true;

    }

    changePage(event: PageEvent): void {
    if (event.pageIndex !== event.previousPageIndex)
        this.pageNumber = event.pageIndex;
        this.loading = true;
    }

    resetSearch(): void {
        this._pageNumber = 0;
        this._pageSize = 50;
        this._sortDirection = 'asc';
        this.sortFieldActive = undefined;
        this.dataSource = new MatTableDataSource();
        this.searchResult = undefined;
        if (this.startSearchOnInit) {
            this.executeSearch();
        }
    }

    onSubmit(): void {
        this.executeSearch();
    }
    
    mapPagingAndSortingCriteria(pagingAndSortingCirteria: PagingAndSortingCriteria): PagingAndSortingCriteria | {
        [key: string]: any;
    } {
        return pagingAndSortingCirteria;
    }

    executeSearch(): void {
        const searchCriteria = this.buildSearchCriteria();
        const pagingAndSortingCriteria = this.buildPagingAndSortingCriteria();
        this.search(searchCriteria, pagingAndSortingCriteria).pipe(takeUntil(this.onDestroy$)).subscribe(response => {
            this.updateSearchResult(response);
            this.loader.hide();
            this.cdRef.detectChanges();
            this.loading = false;
        });
    }

    updateSearchResult(searchResult: M | undefined): void {
        this.searchResult = searchResult;
        this.dataSource.data = (searchResult as { content: M[] })?.content || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalElements = this.dataSource.data.length;      
        //this.loader.show();
    }

    buildPagingAndSortingCriteria(): PagingAndSortingCriteria | {
        [key: string]: any;
    } {
        const sortCriteria = this.buildSortCriteria();
        let criteria: PagingAndSortingCriteria = {};
        if (sortCriteria) {
            criteria.sort = sortCriteria;
        }
        criteria.page = this.pageNumber;
        criteria.size = this.pageSize;
        return this.mapPagingAndSortingCriteria(criteria);
    }

    buildSortCriteria() {
        const sortCriteria = this.sortFieldActive || this.defineSortCriteria();
        if (sortCriteria) {
            if (typeof sortCriteria === 'object') {
                let criteria = '';
                for (const key in sortCriteria) {
                    let query = `${key},${sortCriteria[key]}`;
                    criteria += (criteria === '') ? query : `&sort=${query}`;
                }
                return criteria;
            }
            return `${sortCriteria},${this.sortDirection}`;
        }
        return undefined;
    }

    buildSearchCriteria() {
        const criteria = this.defineSearchCriteria();
        for (let propName in criteria) {
            if (criteria[propName] === null || criteria[propName] === undefined) {
                delete criteria[propName];
            }
        }
        return criteria;
    }
}
