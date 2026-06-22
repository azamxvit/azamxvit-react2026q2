import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Card } from '@/components/article-card';
import type { Character } from '@/types';
import { useSelectedItemsStore } from '@/store';
import { renderWithProviders } from '@/test-utils';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=2&q=luke'),
  usePathname: () => '/en',
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    className,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

const baseItem: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('Card', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsByUrl: {} });
  });

  it('displays name, birth year, and gender', () => {
    renderWithProviders(<Card {...baseItem} />);

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
  });

  it('renders a details link with the current page query', () => {
    renderWithProviders(<Card {...baseItem} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/details/1?q=luke&page=2');
  });

  it('toggles selection via checkbox', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Card {...baseItem} />);

    const checkbox = screen.getByTestId('character-checkbox');
    await user.click(checkbox);

    expect(useSelectedItemsStore.getState().isSelected(baseItem.url)).toBe(true);

    await user.click(checkbox);
    expect(useSelectedItemsStore.getState().isSelected(baseItem.url)).toBe(false);
  });
});
