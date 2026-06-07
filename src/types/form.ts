export type FormSource = 'uncontrolled' | 'react-hook-form';

export interface FormSubmission {
  id: string;
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  imageBase64: string;
  submittedAt: number;
}

import type { FormSchemaInput } from '@/lib/formSchema';

export type FormFieldValues = FormSchemaInput;
