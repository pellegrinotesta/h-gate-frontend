export interface FormItem {
  name: string;
  label: string;
  type?: 'number' | 'text' | 'password' | 'email' | 'select' | 'textarea' | 'autocomplete' | 'image';
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
  hidden?: boolean;
  autoCompleteOptions?: { label: string, value: string | number }[];
  //customValidation?: any;
  controls?: FormItem[];
  array?: FormItem[];
}