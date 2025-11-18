import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { SNACKBAR } from "../enums/snackbar-class.enum";


@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private _snackbar = inject(MatSnackBar);
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    openSnackBar(message: string, action: string,  panelClass?: SNACKBAR) {
        this._snackbar.open(message, action, {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: panelClass ? [panelClass] : []
        });
    }

}