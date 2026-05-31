import { getCharacterId } from '@/api/swapi';
import type { Character } from '@/types/character';

const escapeCsvField = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const buildDetailsUrl = (item: Character): string => {
  const id = getCharacterId(item.url);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/details/${id}`;
};

export const buildCsvContent = (items: Character[]): string => {
  const headers = ['Name', 'Birth Year', 'Gender', 'Details URL'];
  const rows = items.map((item) => [
    item.name,
    item.birth_year,
    item.gender,
    buildDetailsUrl(item),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');
};

export const downloadSelectedItemsAsCsv = (items: Character[]): void => {
  if (items.length === 0) return;

  const csv = buildCsvContent(items);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
