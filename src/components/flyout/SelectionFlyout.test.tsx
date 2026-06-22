import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectionFlyout } from '@/components/flyout';
import type { Character } from '@/types';
import { useSelectedItemsStore } from '@/store';
import { renderWithProviders } from '@/test-utils';

const character: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

vi.mock('@/actions', () => ({
  downloadCsvAction: vi.fn(),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useActionState: () => [null, vi.fn(), false],
  };
});

describe('SelectionFlyout', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsByUrl: {} });
  });

  it('is hidden when no items are selected', () => {
    renderWithProviders(<SelectionFlyout />);

    expect(screen.queryByTestId('selection-flyout')).not.toBeInTheDocument();
  });

  it('shows selected count and action buttons', () => {
    useSelectedItemsStore.setState({ itemsByUrl: { [character.url]: character } });

    renderWithProviders(<SelectionFlyout />);

    expect(screen.getByTestId('selection-flyout')).toBeInTheDocument();
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('clears all selections when Unselect all is clicked', async () => {
    const user = userEvent.setup();
    useSelectedItemsStore.setState({ itemsByUrl: { [character.url]: character } });

    renderWithProviders(<SelectionFlyout />);

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(useSelectedItemsStore.getState().getSelectedItems()).toEqual([]);
    expect(screen.queryByTestId('selection-flyout')).not.toBeInTheDocument();
  });
});
