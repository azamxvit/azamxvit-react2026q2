import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './About';
import { renderWithRouter } from '@/test-utils/renderWithRouter';

describe('About page', () => {
  it('shows author information and a link to the RS School React course', () => {
    renderWithRouter(<About />);

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(/author:/i)).toBeInTheDocument();

    const courseLink = screen.getByRole('link', { name: /rolling scopes school react course/i });
    expect(courseLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});
