import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Subject } from "rxjs";
import { FormItem } from "../../models/form-item.model";



@Component({
    selector: 'app-form-base',
    template: `
      <p>
        base works!
      </p>
    `
})
export abstract class FormBaseComponent implements OnInit, OnDestroy {

    onDestroy$: Subject<any> = new Subject<any>();
    formItems: FormItem[] = [];

    protected fb = inject(FormBuilder);

    ngOnInit() {
        this.createForm();
    }

    abstract createForm(): void;

    ngOnDestroy() {
      this.onDestroy$.next(true);
    }
    
}