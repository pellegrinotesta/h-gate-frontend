import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { SnackbarService } from "../../services/snackbar.service";
import { Location } from '@angular/common';


@Component({
    selector: 'app-base-page',
    template: `
      <p>
        base works!
      </p>
    `
})
export abstract class BasePageComponent implements OnInit, OnDestroy {

    onDestroy$: Subject<any> = new Subject<any>();
    isLoading = false;
    
    protected readonly cdRef = inject(ChangeDetectorRef);
    protected readonly snackBar = inject(SnackbarService);
    protected readonly activatedRoute = inject(ActivatedRoute);
    protected readonly router = inject(Router);
    protected readonly location = inject(Location);

    constructor() {}

    ngOnInit(): void {

    }

    ngOnDestroy() {
      this.onDestroy$.next(true);
    }
}