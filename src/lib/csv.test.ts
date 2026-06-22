import { describe, expect, it } from 'vitest';
import { buildCsvContent } from '@/lib';
import type { Character } from '@/types';

const sampleItem: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('buildCsvContent', () => {
  it('builds csv with headers and escaped values', () => {
    const csv = buildCsvContent([sampleItem], 'http://localhost:3000', 'en');

    expect(csv).toContain('Name,Birth Year,Gender,Details URL');
    expect(csv).toContain('Luke Skywalker,19BBY,male,http://localhost:3000/en/details/1');
  });

  it('escapes commas and quotes', () => {
    const item: Character = {
      ...sampleItem,
      name: 'Darth "Vader", Jr.',
    };

    const csv = buildCsvContent([item], 'http://localhost:3000', 'en');
    expect(csv).toContain('"Darth ""Vader"", Jr."');
  });
});
