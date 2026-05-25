import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Character } from '../../types/character';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import * as downloadCsv from '../../utils/downloadCsv';
import { SelectionFlyout } from './SelectionFlyout';

const character: Character = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('SelectionFlyout', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsByUrl: {} });
  });

  it('is hidden when no items are selected', () => {
    render(<SelectionFlyout />);

    expect(screen.queryByTestId('selection-flyout')).not.toBeInTheDocument();
  });

  it('shows selected count and action buttons', () => {
    useSelectedItemsStore.setState({ itemsByUrl: { [character.url]: character } });

    render(<SelectionFlyout />);

    expect(screen.getByTestId('selection-flyout')).toBeInTheDocument();
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('clears all selections when Unselect all is clicked', async () => {
    const user = userEvent.setup();
    useSelectedItemsStore.setState({ itemsByUrl: { [character.url]: character } });

    render(<SelectionFlyout />);

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(useSelectedItemsStore.getState().getSelectedItems()).toEqual([]);
    expect(screen.queryByTestId('selection-flyout')).not.toBeInTheDocument();
  });

  it('downloads CSV when Download is clicked', async () => {
    const user = userEvent.setup();
    const downloadSpy = vi.spyOn(downloadCsv, 'downloadSelectedItemsAsCsv');
    useSelectedItemsStore.setState({ itemsByUrl: { [character.url]: character } });

    render(<SelectionFlyout />);

    await user.click(screen.getByRole('button', { name: /download/i }));

    expect(downloadSpy).toHaveBeenCalledWith([character]);
    downloadSpy.mockRestore();
  });
});
