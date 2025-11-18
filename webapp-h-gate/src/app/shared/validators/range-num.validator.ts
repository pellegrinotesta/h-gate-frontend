import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rangeNumericoValidator(
  minField: string,
  maxField: string,
  nominaleField?: string,
  tolleranzaField?: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    // check range
    const minControl = formGroup.get(minField);
    const maxControl = formGroup.get(maxField);
    if (!minControl || !maxControl)
      return null;
    const minValue = parseFloat(minControl.value);
    const maxValue = parseFloat(maxControl.value);
    if (isNaN(minValue) || isNaN(maxValue))
      return null;
    if (minValue >= maxValue)
      return { rangeNum: true };
    // check nominale
    if (nominaleField) {
      const nominaleControl = formGroup.get(nominaleField);
      if (!nominaleControl)
        return null;
      const nominaleValue = parseFloat(nominaleControl.value);
      if (isNaN(nominaleValue) || nominaleValue < minValue || nominaleValue > maxValue)
        return { nominale: true };
      // check tolleranza
      if (tolleranzaField) {
        const tolleranzaControl = formGroup.get(tolleranzaField);
        if (!tolleranzaControl)
          return null;
        const tolleranzaValue = parseFloat(tolleranzaControl.value);
        if (isNaN(tolleranzaValue) || maxValue - nominaleValue < tolleranzaValue || nominaleValue - minValue > tolleranzaValue)
          return { tolleranza: true };
      }
    }
    return null;
  };
}
