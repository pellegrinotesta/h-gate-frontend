import { ValidatorFn } from "@angular/forms";

export interface FormItem {
  name: string;
  label: string;
  type?: 'number' | 'text' | 'password' | 'email' | 'select' | 'textarea' | 'autocomplete' | 'image' | 'tel' | 'date' | 'checkbox' | 'radio' | 'file' | 'array' | 'group';
  options?: { label: string, value: any }[];
  initialValue?: any;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  readonlyCondition?: (data: any, userRole?: string) => boolean;
  hidden?: boolean;
  autoCompleteOptions?: { label: string, value: string | number }[];
  //customValidation?: any;
  controls?: FormItem[];
  array?: FormItem[];
  validators?: ValidatorFn[];
  colClass?: string;
  rows?: number;
  placeholder?: string;
  excludeFromRender?: boolean;
  condition?: (data: any) => boolean;
}