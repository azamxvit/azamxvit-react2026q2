import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CardList } from '@/components/article-list';
import type { Character } from '@/types';
import { renderWithProviders } from '@/test-utils';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/en',
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

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

    renderWithProviders(<CardList items={items} />);

    expect(screen.getByText('Luke')).toBeInTheDocument();
    expect(screen.getByText('C-3PO')).toBeInTheDocument();
  });

  it('renders an empty list container when no items are provided', () => {
    const { container } = renderWithProviders(<CardList items={[]} />);

    expect(container.querySelector('.card-list')?.children.length).toBe(0);
  });
});
