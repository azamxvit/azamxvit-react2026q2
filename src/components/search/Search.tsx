import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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
        placeholder="Search Star Wars characters..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
