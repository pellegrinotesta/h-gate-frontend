import { AdvancedSearchOperator } from "./advanced-search-operator.enum";
export interface AdvancedSearchSimpleCriteria {
    field: string;
    operator: AdvancedSearchOperator;
    value: any;
}