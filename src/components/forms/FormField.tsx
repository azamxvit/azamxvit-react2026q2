import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      <p className="form-field__error" role="alert" aria-live="polite">
        {error ?? '\u00A0'}
      </p>
    </div>
  );
}
