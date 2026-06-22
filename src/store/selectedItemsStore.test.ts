import { describe, expect, it } from 'vitest';
import type { Character } from '@/types';
import { useSelectedItemsStore } from '@/store';

describe('selectedItemsStore', () => {
  it('starts with an empty selection', () => {
    expect(useSelectedItemsStore.getState().getSelectedItems()).toEqual([]);
  });

  it('toggles items by url', () => {
    const character: Character = {
      name: 'Luke Skywalker',
      birth_year: '19BBY',
      gender: 'male',
      url: 'https://swapi.py4e.com/api/people/1/',
    };

    useSelectedItemsStore.getState().toggleItem(character);
    expect(useSelectedItemsStore.getState().isSelected(character.url)).toBe(true);

    useSelectedItemsStore.getState().toggleItem(character);
    expect(useSelectedItemsStore.getState().isSelected(character.url)).toBe(false);
  });
});
