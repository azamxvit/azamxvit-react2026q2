import { create } from 'zustand';
import type { Character } from '@/types';

interface SelectedItemsState {
  itemsByUrl: Record<string, Character>;
  toggleItem: (item: Character) => void;
  removeItem: (url: string) => void;
  clearAll: () => void;
  isSelected: (url: string) => boolean;
  getSelectedItems: () => Character[];
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  itemsByUrl: {},

  toggleItem: (item) => {
    set((state) => {
      const next = { ...state.itemsByUrl };
      if (next[item.url]) {
        delete next[item.url];
      } else {
        next[item.url] = item;
      }
      return { itemsByUrl: next };
    });
  },

  removeItem: (url) => {
    set((state) => {
      if (!state.itemsByUrl[url]) return state;
      const next = { ...state.itemsByUrl };
      delete next[url];
      return { itemsByUrl: next };
    });
  },

  clearAll: () => set({ itemsByUrl: {} }),

  isSelected: (url) => Boolean(get().itemsByUrl[url]),

  getSelectedItems: () => Object.values(get().itemsByUrl),
}));
