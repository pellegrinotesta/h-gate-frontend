import { Component, input, OnInit } from "@angular/core";
import { ListBase } from "./list-base.component";
import { PaginatedResponseData } from "../../models/response.model";

@Component({
  selector: 'app-base-list',
  template: `
      <p>
        base works!
      </p>
    `
})
export abstract class ListBaseComponent<T> extends ListBase<T> {

  data = input<PaginatedResponseData<any[]>>({} as PaginatedResponseData<any[]>);

  goNextPage(): void {
    this.changePage.emit({ url: this.data().next, direction: 'next' });
  }

  goPreviousPage(): void {
    this.changePage.emit({ url: this.data().previous, direction: 'previous' });
  }

  executeSearch(pageSize: number, filter?: T): void {
    this.search.emit({ filter: filter ?? {} as T, pageSize });
  }

}