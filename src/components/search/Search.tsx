import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { UI_LABELS } from '@/constants/labels';

interface Props {
  initialValue: string;
  onSearch: (searchTerm: string) => void;
}

export function Search({ initialValue, onSearch }: Props) {
  const [inputValue, setInputValue] = useState<string>(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  return (
    <form className="search-section" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={UI_LABELS.search.placeholder}
      />
      <button type="submit">{UI_LABELS.search.submit}</button>
    </form>
  );
}
