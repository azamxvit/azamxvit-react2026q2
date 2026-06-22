import type { ReactElement } from 'react';
import { renderWithProviders } from './renderWithProviders';

export function renderWithRouter(ui: ReactElement) {
  return renderWithProviders(ui);
}
