import { memo } from 'react';
import styles from './year-selector.module.css';

type YearSelectorProps = {
  year: number;
  years: number[];
  onChange: (year: number) => void;
};

export const YearSelector = memo(({ year, years, onChange }: YearSelectorProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor="year" className={styles.label}>
        Select year:
      </label>
      <select
        id="year"
        value={year}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.select}
      >
        {years.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
});

YearSelector.displayName = 'YearSelector';
