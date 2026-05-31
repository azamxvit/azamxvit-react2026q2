import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardList } from '@/components/article-list/CardList';
import type { Character } from '@/types/character';
import { renderWithRouter } from '@/test-utils/renderWithRouter';

const buildCharacter = (overrides: Partial<Character> = {}): Character => ({
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
  ...overrides,
});

describe('CardList', () => {
  it('renders one card per item when data is provided', () => {
    const items = [
      buildCharacter({ url: 'https://swapi.py4e.com/api/people/1/', name: 'Luke' }),
      buildCharacter({ url: 'https://swapi.py4e.com/api/people/2/', name: 'C-3PO' }),
    ];

    renderWithRouter(<CardList items={items} />);

    expect(screen.getByText('Luke')).toBeInTheDocument();
    expect(screen.getByText('C-3PO')).toBeInTheDocument();
  });

  it('shows a no-results message when the list is empty', () => {
    renderWithRouter(<CardList items={[]} />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});
