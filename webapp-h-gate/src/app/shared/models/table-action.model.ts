import { TableOperation } from "./table-operation.model";

export interface TableAction {
  operation: TableOperation;
  title: string;
  icon?: string;
  permission?: string[],
  tooltip?: string,
  isDisabled?: any;
};
  