import { beforeEach, describe, expect, it } from 'vitest';
import type { Character } from '@/types/character';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';

const character: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

const anotherCharacter: Character = {
  name: 'C-3PO',
  birth_year: '112BBY',
  gender: 'n/a',
  url: 'https://swapi.py4e.com/api/people/2/',
};

describe('selectedItemsStore', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsByUrl: {} });
  });

  it('adds an item when toggled on', () => {
    useSelectedItemsStore.getState().toggleItem(character);

    expect(useSelectedItemsStore.getState().isSelected(character.url)).toBe(true);
    expect(useSelectedItemsStore.getState().getSelectedItems()).toEqual([character]);
  });

  it('removes an item when toggled off', () => {
    useSelectedItemsStore.getState().toggleItem(character);
    useSelectedItemsStore.getState().toggleItem(character);

    expect(useSelectedItemsStore.getState().getSelectedItems()).toEqual([]);
  });

  it('removes an item via removeItem', () => {
    useSelectedItemsStore.getState().toggleItem(character);
    useSelectedItemsStore.getState().removeItem(character.url);

    expect(useSelectedItemsStore.getState().isSelected(character.url)).toBe(false);
  });

  it('clears all selected items', () => {
    useSelectedItemsStore.getState().toggleItem(character);
    useSelectedItemsStore.getState().toggleItem(anotherCharacter);
    useSelectedItemsStore.getState().clearAll();

    expect(useSelectedItemsStore.getState().getSelectedItems()).toEqual([]);
  });
});
