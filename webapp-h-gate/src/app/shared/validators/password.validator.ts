import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export function PasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentPasswordControl = control.get('currentPassword');
    const newPasswordControl = control.get('newPassword');
    const confirmPasswordControl = control.get('confirmPassword');

    const currentPassword = currentPasswordControl?.value;
    const newPassword = newPasswordControl?.value;
    const confirmPassword = confirmPasswordControl?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword != confirmPassword && newPassword && confirmPassword) {
      return { passwordMismatch: true };
    }

    if (newPassword === currentPassword && currentPassword) {
      return { passwordNotChanged: true };
    }

    return null;
  };
}
