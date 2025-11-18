import { Component, inject, input, output } from "@angular/core";
import { SnackbarService } from "../../services/snackbar.service";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { FormItem } from "../../models/form-item.model";

@Component({
    selector: 'app-base-list',
    template: `
      <p>
        base works!
      </p>
    `
})
export abstract class ListBase<T> {

  startSearchOnInit = input<boolean>(true);
  changePage = output<{ url: string, direction: 'next' | 'previous' }>();
  changeSize = output<number>();
  search = output<{ filter: T, pageSize: number }>();

  formItems: FormItem[] = [];
  currentFilter: T | undefined;
  size = 10;
  isLoading = false;
  
  protected readonly router = inject(Router);
  protected readonly snackBar = inject(SnackbarService);
  protected readonly location = inject(Location);

  onReset(): void {
    this.onSearch();
  }
  
  onSearch(filter?: T): void {
    this.currentFilter = filter;
    this.executeSearch(this.size, filter);
  }

  onChangePage(direction: 'next' | 'previous'): void {
    direction == 'next' ?
      this.goNextPage() :
      this.goPreviousPage();
  }

  onPageSizeChanged(size: number): void {
    this.size = size;
    this.executeSearch(this.size, this.currentFilter);
  }

  abstract goNextPage(): void;
  abstract goPreviousPage(): void;
  abstract executeSearch(pageSize?: number, filter?: T): void;

}