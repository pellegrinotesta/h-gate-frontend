import { Component, OnInit } from "@angular/core";
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
export abstract class ListBasePage<T> extends ListBase<T> implements OnInit {

  data: PaginatedResponseData<any[]> = {} as PaginatedResponseData<any[]>;

  ngOnInit(): void {
    this.executeSearch(this.size, undefined);
  }

}