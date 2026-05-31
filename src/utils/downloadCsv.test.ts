import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Character } from '@/types/character';
import { buildCsvContent, downloadSelectedItemsAsCsv } from './downloadCsv';

const sampleItem: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('downloadCsv', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { origin: 'http://localhost:3000' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds CSV with name, birth year, gender, and details URL', () => {
    const csv = buildCsvContent([sampleItem]);

    expect(csv).toContain('Name,Birth Year,Gender,Details URL');
    expect(csv).toContain('Luke Skywalker,19BBY,male,http://localhost:3000/details/1');
  });

  it('escapes fields that contain commas or quotes', () => {
    const item: Character = {
      ...sampleItem,
      name: 'Luke "Sky", Walker',
    };

    const csv = buildCsvContent([item]);
    expect(csv).toContain('"Luke ""Sky"", Walker"');
  });

  it('downloads a CSV file with a count-based filename', () => {
    const createObjectURL = vi.fn(() => 'blob:mock-url');
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    });

    const link = document.createElement('a');
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(Object.assign(link, { click }));

    downloadSelectedItemsAsCsv([sampleItem, { ...sampleItem, url: 'https://swapi.py4e.com/api/people/2/' }]);

    expect(createObjectURL).toHaveBeenCalled();
    expect(link.download).toBe('2_items.csv');
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    createElementSpy.mockRestore();
  });

  it('does nothing when there are no items', () => {
    const createObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() });

    downloadSelectedItemsAsCsv([]);

    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
