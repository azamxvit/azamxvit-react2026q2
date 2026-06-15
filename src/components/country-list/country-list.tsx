import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

type CountryRowProps = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const LIST_HEIGHT = 640;
const CARD_BASE_HEIGHT = 132;
const TABLE_ROW_HEIGHT = 32;

const getCardHeight = (columnCount: number) => CARD_BASE_HEIGHT + columnCount * TABLE_ROW_HEIGHT;

const CountryRow = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
  ariaAttributes,
}: RowComponentProps<CountryRowProps>) => {
  const country = countries[index];

  if (!country) {
    return <div style={style} />;
  }

  return (
    <div style={style} className={styles.row} {...ariaAttributes}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const normalizedQuery = searchQuery.toLowerCase();

      return countries
        .filter((country) => {
          const matchesSearch = country.id.toLowerCase().includes(normalizedQuery);
          const matchesRegion =
            !selectedRegion || country.data.some((entry) => entry.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((left, right) => {
          if (sortField === 'name') {
            return sortOrder === 'asc'
              ? left.id.localeCompare(right.id)
              : right.id.localeCompare(left.id);
          }

          const leftPopulation =
            getPopulationForYear(createYearDataMap(left.data), selectedYear) || 0;
          const rightPopulation =
            getPopulationForYear(createYearDataMap(right.data), selectedYear) || 0;

          return sortOrder === 'asc'
            ? leftPopulation - rightPopulation
            : rightPopulation - leftPopulation;
        });
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const rowProps = useMemo(
      () => ({
        countries: filteredCountries,
        selectedYear,
        selectedColumns,
      }),
      [filteredCountries, selectedYear, selectedColumns],
    );

    const rowHeight = useMemo(
      () => getCardHeight(selectedColumns.length),
      [selectedColumns.length],
    );

    if (filteredCountries.length === 0) {
      return <div className={styles.emptyState}>No countries match your filters.</div>;
    }

    return (
      <List
        className={styles.countryList}
        rowCount={filteredCountries.length}
        rowHeight={rowHeight}
        rowComponent={CountryRow}
        rowProps={rowProps}
        style={{ height: LIST_HEIGHT, width: '100%' }}
        overscanCount={4}
      />
    );
  },
);

CountryList.displayName = 'CountryList';
