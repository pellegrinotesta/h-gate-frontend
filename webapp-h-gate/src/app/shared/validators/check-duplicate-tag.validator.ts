import { ValidatorFn, AbstractControl, ValidationErrors, FormArray, FormGroup } from "@angular/forms";

export function NoDuplicateTagsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    
    if (!formArray || !formArray.controls) {
      return null;
    }

    const tags: string[] = formArray.controls
      .map((group: AbstractControl) => {
        const formGroup = group as FormGroup;
        const tagValue = formGroup.get('tag')?.value;
        return tagValue ? tagValue.trim().toLowerCase() : null;
      })
      .filter((tag): tag is string => tag !== null && tag !== '');

    const duplicates = tags.filter((tag, index) => tags.indexOf(tag) !== index);

    if (duplicates.length > 0) {
      formArray.controls.forEach((group: AbstractControl) => {
        const formGroup = group as FormGroup;
        const tagControl = formGroup.get('tag');
        const tagValue = tagControl?.value?.trim().toLowerCase();
        
        // marca il tag come invalid oppure rimuovi l'errore
        if (tagValue && duplicates.includes(tagValue)) {
          tagControl?.setErrors({ ...tagControl.errors, duplicate: true });
        } else if (tagControl?.hasError('duplicate')) {
          const errors = { ...tagControl.errors };
          delete errors['duplicate'];
          tagControl?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      });

      return { duplicateTags: true };
    }
    else {
        formArray.controls.forEach((group: AbstractControl) => {
        const formGroup = group as FormGroup;
        const tagControl = formGroup.get('tag');
        if (tagControl?.hasError('duplicate')) {
            const errors = { ...tagControl.errors };
            delete errors['duplicate'];
            tagControl?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
        });
    }

    return null;
  };
}