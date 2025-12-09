import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { FormItem } from '../../models/form-item.model';
import { MatDatepickerModule } from "@angular/material/datepicker";

@Component({
  selector: 'app-generic-form',
  imports: [SharedModule, ReactiveFormsModule, MatDatepickerModule],
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

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() formChanged = new EventEmitter<any>();

  form!: FormGroup;

  visibleFields = computed(() => {
    return this.fields.filter(field => {
      // Escludi se il campo ha hidden=true
      if (field.hidden || field.excludeFromRender) {
        return false;
      }
      // Escludi se il campo è nella lista excludeFields
      if (this.excludeFields && this.excludeFields.includes(field.name)) {
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

  ngOnChanges(): void {
    if (this.form && this.initialData) {
      this.patchForm(this.initialData);
    }
  }


  private initForm(): void {
    const formConfig: { [key: string]: any } = {};

    this.fields.forEach(field => {
      formConfig[field.name] = ['', field.validators || []];
    });

    this.form = this.fb.group(formConfig, {
      validators: this.formValidator || []
    });

    // Emetti i cambiamenti del form
    this.form.valueChanges.subscribe(value => {
      this.formChanged.emit(value);
    });
  }

  private patchForm(data: any): void {
    if (!data) return;

    const patchData: { [key: string]: any } = {};
    this.fields.forEach(field => {
      if (data.hasOwnProperty(field.name)) {
        patchData[field.name] = data[field.name];
      }
    });

    this.form.patchValue(patchData);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) {
      // Controlla se c'è un errore a livello di form (es. passwordMismatch)
      if (this.form.errors) {
        if (this.form.errors['passwordMismatch'] && fieldName === 'confirmPassword') {
          return 'Le password non coincidono';
        }
      }
      return '';
    }

    const errors = control.errors;

    if (errors['required']) return 'Campo obbligatorio';
    if (errors['email']) return 'Email non valida';
    if (errors['minlength']) return `Minimo ${errors['minlength'].requiredLength} caratteri`;
    if (errors['maxlength']) return `Massimo ${errors['maxlength'].requiredLength} caratteri`;
    if (errors['min']) return `Valore minimo: ${errors['min'].min}`;
    if (errors['max']) return `Valore massimo: ${errors['max'].max}`;
    if (errors['pattern']) return 'Formato non valido';

    return 'Campo non valido';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      })
    }
  }

  onCancel(): void {
    this.cancel.emit();
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
