import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';
import { THEME } from '@/constants';
import { useSelectedItemsStore } from '@/store';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/en',
}));

beforeEach(() => {
  useSelectedItemsStore.setState({ itemsByUrl: {} });
  document.documentElement.setAttribute('data-theme', THEME.LIGHT);
});
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
