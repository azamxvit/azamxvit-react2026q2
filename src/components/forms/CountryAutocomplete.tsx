import type { InputHTMLAttributes } from 'react';

interface CountryAutocompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'list' | 'type'> {
  countries: readonly string[];
  listId: string;
}

export function CountryAutocomplete({
  countries,
  listId,
  className = 'form-input',
  ...inputProps
}: CountryAutocompleteProps) {
  return (
    <>
      <input
        {...inputProps}
        type="text"
        list={listId}
        className={className}
        autoComplete="off"
      />
      <datalist id={listId}>
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
    </>
  );
}
