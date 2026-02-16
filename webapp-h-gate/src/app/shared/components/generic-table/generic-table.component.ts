import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnChanges, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { TableAction } from '../../models/table-action.model';
import { Column } from '../../models/column.model';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatMenuModule, MatListModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatBadgeModule, MatTooltipModule, MatCheckboxModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() columns: Column[] = [];
  @Input() selectable = false;
  @Input() removeable = true;
  @Input() singleSelectable = false;
  @Input() initialSelection: any[] = [];
  @Input() rowFocused: any;
  @Input() isDataPaginated = true;
  @Input() totalElements: number = 0;
  @Input() size = 10;
  changePage = output<'next' | 'previous'>();
  pageSizeChanged = output<number>();
  clickEvent = output<{ action: TableAction, element: any }>();
  selectionChange = output<any[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  expandedElement: any | null;
  authenticatedUser: AuthenticatedUser | null = null;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  authorizedActions: TableAction[] = [];
  selection = new SelectionModel<any>(true, []);

  userService = inject(AuthService);


  totalPages: number = 0;
  pageIndex: number = 0;

  ngOnInit(): void {
    this.authenticatedUser = this.userService.getStoredUsed() ?? null;
    this.authorizedActions = this.getAuthorizedActions();
    this.displayedColumns = this.columns.map(column => column.columnDef ?? column.attributeName)
      .concat(this.authorizedActions.length > 0 && !this.selectable ? ['actions'] : []);
    if (this.selectable) this.displayedColumns.unshift('select');
    this.dataSource = new MatTableDataSource<any>(this.data);
    if (this.isDataPaginated) {
      this.dataSource.paginator = this.paginator;
      this.totalPages = this.totalElements / this.size;
    }
  }

  ngAfterViewInit() {
    if (!this.isDataPaginated)
      this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.dataSource = new MatTableDataSource<any>(this.data);
      if (!this.isDataPaginated)
        this.dataSource.paginator = this.paginator;
    }
    if (changes['initialSelection']) {
      this.selection.clear();
      this.selection.select(...this.initialSelection);
    }
  }

  getAuthorizedActions(): any[] {
    let authorizedActions = this.actions.filter(action => this.isAuthorized(action.permission));
    return authorizedActions;
  }

  isAuthorized(permission?: string[]): boolean {
    if (this.authenticatedUser && (!permission || permission.some(p => this.authenticatedUser?.authorities.includes(p))))
      return true;
    return false;
  }

  onAction(action: TableAction, element: any): void {
    this.clickEvent.emit({ action, element });
  }

  transformValue(value: any, fn: any): any {
    return fn(value);
  }

  onRowClick(row: any) {
    if (!this.singleSelectable) return;
    this.selection.clear();
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected())
      this.selection.clear();
    else
      this.selection.select(...this.dataSource.data);
    this.selectionChange.emit(this.selection.selected);
  }

  checkboxLabel(row?: any): string {
    if (!row)
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  emitPageChange(event: PageEvent): void {
    if (event.pageIndex < this.pageIndex)
      this.changePage.emit('previous');
    else if (event.pageIndex > this.pageIndex)
      this.changePage.emit('next');

    if (event.pageSize !== this.size)
      this.pageSizeChanged.emit(event.pageSize);
    this.pageIndex = event.pageIndex;
  }

}
