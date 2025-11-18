import { Component, inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BasePageComponent } from "./base-page.component";


@Component({
    selector: 'app-base-page',
    template: `
      <p>
        base works!
      </p>
    `
})
export abstract class FormBasePageComponent extends BasePageComponent {

    form: any;

    protected fb = inject(FormBuilder);

    constructor() {
        super();
        this.createForm();
    }

    abstract createForm(): void;
}