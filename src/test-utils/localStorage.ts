import { vi } from 'vitest';

export function installLocalStorageMock(): {
  mockStorage: Storage;
  clearStore: () => void;
  seed: (key: string, value: string) => void;
} {
  const map = new Map<string, string>();

  const mockStorage = {
    getItem: vi.fn((key: string) => (map.has(key) ? map.get(key)! : null)),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      map.delete(key);
    }),
    clear: vi.fn(() => {
      map.clear();
    }),
    key: vi.fn(),
    length: 0,
  } as unknown as Storage;

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: mockStorage,
  });

  return {
    mockStorage,
    clearStore: () => map.clear(),
    seed: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}
