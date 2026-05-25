import type { ReactElement } from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

export function renderWithRouter(
  ui: ReactElement,
  options: Options = {},
): RenderResult {
  return renderWithProviders(ui, options);
}
