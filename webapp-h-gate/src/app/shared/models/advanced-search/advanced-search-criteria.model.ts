import { AdvancedSearchSimpleCriteria } from "./advanced-search-simple-criteria.model";
export interface AdvancedSearchCriteria {
    operandOne: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria;
    operandTwo: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria;
    operator: 'OR' | 'AND';
}