import { Component, computed, EventEmitter, inject, Input, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { FormItem } from '../../models/form-item.model';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, MatDatepickerModule, MatCheckboxModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss'
})
export class GenericFormComponent implements OnInit {

  private fb = inject(FormBuilder);

  @Input() fields: FormItem[] = [];
  @Input() initialData: any = {};
  @Input() editMode = false;
  @Input() showButtons = true;
  @Input() submitButtonText = 'Salva';
  @Input() cancelButtonText = 'Annulla';
  @Input() formValidator?: ValidatorFn | ValidatorFn[];
  @Input() excludeFields?: string[];
  @Input() resetable: boolean = false;
  @Input() enterable = true;
  @Input() autoClear: boolean = false;
  @Input() userRole?: string;
  @Input() cancellable: boolean = true;

  @Output() cancel = new EventEmitter<void>();
  @Output() formChanged = new EventEmitter<any>();
  submit = output<any>();
  reset = output<void>();

  form!: FormGroup;

  visibleFields = computed(() => {
    return this.fields.filter(field => {
      if (field.hidden || field.excludeFromRender) {
        return false;
      }
      if (this.excludeFields && this.excludeFields.includes(field.name)) {
        return false;
      }
      if (field.condition && !field.condition(this.initialData)) {
        return false;
      }
      return true;
    });
  });

  ngOnInit(): void {
    this.initForm();
    if (this.initialData) {
      this.patchForm(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.form && this.initialData) {
      this.patchForm(this.initialData);
    }

    if (changes['editMode'] && this.form) {
      this.updateFormState();
    }
  }

  private updateFormState(): void {
    if (this.editMode) {
      this.form.enable({ emitEvent: false });
      this.fields.forEach(field => {
        const control = this.form.get(field.name);
        if (control) {
          const isReadonly = field.readonly || (field.readonlyCondition && field.readonlyCondition(this.initialData, this.userRole));

          if (isReadonly) {
            control.disable({ emitEvent: false });
          }
        }
      })
    } else {
      this.form.disable({ emitEvent: false });
    }
  }

  private initForm(): void {
    const formConfig: { [key: string]: any } = {};

    this.fields.forEach(field => {
      if (field.type === 'section-header') return;

      // ← Gestisci il tipo array
      if (field.type === 'array') {
        formConfig[field.name] = this.fb.array([]);
        return;
      }

      const control = this.fb.control(
        field.initialValue ?? '',
        field.validators || []
      );

      const isReadonly = field.readonly ||
        (field.readonlyCondition &&
          field.readonlyCondition(this.initialData, this.userRole));

      if (isReadonly || field.disabled) {
        control.disable();
      }

      formConfig[field.name] = control;
    });

    this.form = this.fb.group(formConfig, {
      validators: this.formValidator || []
    });

    this.updateFormState();

    this.form.valueChanges.subscribe(value => {
      this.formChanged.emit(value);
    });
  }

  isFieldReadonly(field: FormItem): boolean {
    return field.readonly ||
      (field.readonlyCondition ? field.readonlyCondition(this.initialData, this.userRole) : false);
  }

  private patchForm(data: any): void {
    if (!data) return;

    this.fields.forEach(field => {
      if (!data.hasOwnProperty(field.name)) return;

      // ← Gestisci il tipo array
      if (field.type === 'array') {
        const formArray = this.form.get(field.name) as FormArray;
        while (formArray.length) formArray.removeAt(0);

        const items: any[] = data[field.name] ?? [];
        items.forEach(item => {
          if (field.array?.[0]?.controls) {
            const groupConfig: any = {};
            field.array[0].controls.forEach(ctrl => {
              groupConfig[ctrl.name] = [item[ctrl.name] ?? '', ctrl.validators || []];
            });
            formArray.push(this.fb.group(groupConfig));
          } else {
            formArray.push(this.fb.control(item, []));
          }
        });
        return;
      }

      this.form.patchValue({ [field.name]: data[field.name] });
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);

    if (!control) {
      return '';
    }

    // Controlla prima gli errori del controllo
    if (control.errors) {
      const errors = control.errors;

      if (errors['passwordMismatch']) {
        return 'Le password non coincidono';
      }

      if (errors['required']) return 'Campo obbligatorio';
      if (errors['email']) return 'Email non valida';
      if (errors['minlength']) return `Minimo ${errors['minlength'].requiredLength} caratteri`;
      if (errors['maxlength']) return `Massimo ${errors['maxlength'].requiredLength} caratteri`;
      if (errors['min']) return `Valore minimo: ${errors['min'].min}`;
      if (errors['max']) return `Valore massimo: ${errors['max'].max}`;
      if (errors['pattern']) return 'Formato non valido';

      return 'Campo non valido';
    }

    // Controlla se c'è un errore a livello di form
    if (this.form.errors && this.form.errors['passwordMismatch'] && fieldName === 'confirmPassword') {
      return 'Le password non coincidono';
    }

    return '';
  }

  getControls(formArrayName: string): AbstractControl[] {
    const control = this.form.get(formArrayName);
    return control instanceof FormArray ? control.controls : [];
  }

  // Metodo per aggiungere un elemento all'array (usato nel template)
  addArrayItem(item: FormItem) {
    const formArray = this.form.get(item.name) as FormArray;
    if (item.array && item.array.length > 0) {
      const template = item.array[0];
      if (template.controls) {
        // Se è un array di gruppi, crea un nuovo FormGroup
        const groupConfig: any = {};
        template.controls.forEach(ctrl => {
          groupConfig[ctrl.name] = ['', ctrl.validators || []];
        });
        formArray.push(this.fb.group(groupConfig));
      } else {
        // Se è un array di controlli semplici
        formArray.push(this.fb.control('', template.validators || []));
      }
    }
  }

  // Metodo per rimuovere un elemento dall'array
  removeArrayItem(item: FormItem, index: number) {
    const formArray = this.form.get(item.name) as FormArray;
    formArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.editMode = false;
  }

  onReset() {
    this.form.reset();
    this.reset.emit();
  }


  public getFormValue(): any {
    return this.form.value;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public isFormValid() {
    return this.form.valid;
  }

}