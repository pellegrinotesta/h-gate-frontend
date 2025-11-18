import { Component, ViewChild } from "@angular/core";
import { BasePageComponent } from "./base-page.component";
import { MatStepper } from "@angular/material/stepper";


@Component({
    selector: 'app-stepper-base-page',
    template: `
      <p>
        base works!
      </p>
    `
})
export abstract class StepperBasePageComponent<T> extends BasePageComponent {

    @ViewChild(MatStepper) stepper!: MatStepper;

    treeElementSelected?: T;
    treeSelectable = false;

    constructor() {
        super();
    }

    goToNextStep(): void {
        if (this.stepper?.selected)
        this.stepper.selected.completed = true;
        this.stepper?.next();
        this.treeElementSelected = undefined;
    }

    goPreviousStep(): void {
        if (this.stepper?.selected)
        this.stepper.selected.completed = false;
        this.stepper?.previous();
        this.treeElementSelected = undefined;
    }

}