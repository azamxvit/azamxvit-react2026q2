import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotFound } from './NotFound';
import { renderWithRouter } from '@/test-utils/renderWithRouter';

describe('NotFound page', () => {
  it('displays a 404 message and a link back to the home page', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/page you are looking for does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });
});
