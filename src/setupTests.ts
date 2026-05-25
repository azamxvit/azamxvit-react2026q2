import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';
import { useSelectedItemsStore } from './store/selectedItemsStore';

beforeEach(() => {
  useSelectedItemsStore.setState({ itemsByUrl: {} });
  document.documentElement.setAttribute('data-theme', 'light');
});
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
