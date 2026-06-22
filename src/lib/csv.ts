import { getCharacterId } from '@/services';
import type { Character } from '@/types';

const escapeCsvField = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const buildDetailsUrl = (item: Character, origin: string, locale: string): string => {
  const id = getCharacterId(item.url);
  return `${origin}/${locale}/details/${id}`;
};

export const buildCsvContent = (
  items: Character[],
  origin: string,
  locale: string,
): string => {
  const headers = ['Name', 'Birth Year', 'Gender', 'Details URL'];
  const rows = items.map((item) => [
    item.name,
    item.birth_year,
    item.gender,
    buildDetailsUrl(item, origin, locale),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');
};
