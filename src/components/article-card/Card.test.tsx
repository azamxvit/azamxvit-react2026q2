import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';
import type { Character } from '../../types/character';

const baseItem: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('Card', () => {
  it('displays name, birth year, and gender', () => {
    render(<Card item={baseItem} />);

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
  });

  it('still renders labels when optional-looking fields are empty strings', () => {
    const item: Character = {
      ...baseItem,
      name: 'Unknown',
      birth_year: '',
      gender: '',
    };

    const { container } = render(<Card item={item} />);

    expect(screen.getByRole('heading', { name: 'Unknown' })).toBeInTheDocument();
    expect(within(container).getByText(/Birth Year/i)).toBeInTheDocument();
    expect(within(container).getByText(/Gender/i)).toBeInTheDocument();
  });
});
