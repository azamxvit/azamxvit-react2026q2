import { screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';
import type { Character } from '../../types/character';
import { renderWithRouter } from '../../test-utils/renderWithRouter';

const baseItem: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('Card', () => {
  it('displays name, birth year, and gender', () => {
    renderWithRouter(<Card item={baseItem} />);

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
  });

  it('renders as a link pointing to the character details route', () => {
    renderWithRouter(<Card item={baseItem} />, { route: '/?page=2' });

    const link = screen.getByTestId('character-card');
    expect(link).toHaveAttribute('href', expect.stringMatching(/^\/details\/1\?/));
    expect(link.getAttribute('href')).toContain('page=2');
    expect(link.getAttribute('href')).toContain('details=1');
  });

  it('still renders labels when optional-looking fields are empty strings', () => {
    const item: Character = { ...baseItem, name: 'Unknown', birth_year: '', gender: '' };

    const { container } = renderWithRouter(<Card item={item} />);

    expect(screen.getByRole('heading', { name: 'Unknown' })).toBeInTheDocument();
    expect(within(container).getByText(/Birth Year/i)).toBeInTheDocument();
    expect(within(container).getByText(/Gender/i)).toBeInTheDocument();
  });
});
