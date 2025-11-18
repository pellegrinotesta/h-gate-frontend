import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AdvancedSearchCriteria } from "../../models/advanced-search/advanced-search-criteria.model";
import { AdvancedSearchSimpleCriteria } from "../../models/advanced-search/advanced-search-simple-criteria.model";
import { SearchBasePageComponent } from "./search-base-page.component";
import { PagingAndSortingCriteria } from "../../models/advanced-search/paging-and-sorting-criteria.model";
import { EmptyObject } from "../../base/authentication/types/empty-object.type";


@Component({
    selector: 'app-base-page',
    template: `
      <p>
        base works!
      </p>
    `,
    standalone: false
})
export abstract class AdvancedSearchBasePageComponent<M> extends SearchBasePageComponent<M> {

    showAdvandedSearch = false;

    protected abstract override search(criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria, sortCriteria?: PagingAndSortingCriteria): Observable<M>;
    protected abstract override defineSearchCriteria(): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria | EmptyObject;

    protected createAndComplexCriteria(criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[]): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria {
      if (criteriaArray.length === 0) {
        throw new Error('Invalid criteriaArray; the array is empty.');

      } else if (criteriaArray.length === 1) {
        return criteriaArray[0];

      } else {
         const firstCriteria = criteriaArray.shift();
         if (firstCriteria != undefined ){
          return {
          operandOne: firstCriteria,
          operandTwo: this.createAndComplexCriteria(criteriaArray),
          operator: 'AND',
          };
        } else {
          throw new Error('Error during construction of criteria.');
        }
      }
    }
    protected createOrComplexCriteria(criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[]): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria {
      if (criteriaArray.length === 0) {
        throw new Error('Invalid criteriaArray; the array is empty.');

      } else if (criteriaArray.length === 1) {
        return criteriaArray[0];

      } else {
         const firstCriteria = criteriaArray.shift();
         if (firstCriteria != undefined ){
          return {
          operandOne: firstCriteria,
          operandTwo: this.createOrComplexCriteria(criteriaArray),
          operator: 'OR',
          };
        } else {
          throw new Error('Error during construction of criteria.');
        }
      }
    }
}
