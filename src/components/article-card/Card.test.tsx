import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, it, expect } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { Card } from '@/components/article-card/Card';
import type { Character } from '@/types/character';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';
import { renderWithRouter } from '@/test-utils/renderWithRouter';

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
    renderWithRouter(<Card {...baseItem} />);

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
  });

  it('navigates to details when the card body is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/" element={<Card {...baseItem} />} />
        <Route path="/details/:id" element={<div data-testid="details-route">Details</div>} />
      </Routes>,
      { route: '/?page=2' },
    );

    await user.click(screen.getByTestId('character-card'));

    expect(await screen.findByTestId('details-route')).toBeInTheDocument();
  });

  it('toggles selection via checkbox without navigating', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/" element={<Card {...baseItem} />} />
        <Route path="/details/:id" element={<div data-testid="details-route">Details</div>} />
      </Routes>,
      { route: '/?page=1' },
    );

    const checkbox = screen.getByTestId('character-checkbox');
    await user.click(checkbox);

    expect(useSelectedItemsStore.getState().isSelected(baseItem.url)).toBe(true);
    expect(screen.queryByTestId('details-route')).not.toBeInTheDocument();

    await user.click(checkbox);
    await waitFor(() =>
      expect(useSelectedItemsStore.getState().isSelected(baseItem.url)).toBe(false),
    );
  });

  it('still renders labels when optional-looking fields are empty strings', () => {
    const item: Character = { ...baseItem, name: 'Unknown', birth_year: '', gender: '' };

    renderWithRouter(<Card {...item} />);

    expect(screen.getByRole('heading', { name: 'Unknown' })).toBeInTheDocument();
    expect(screen.getByText(/Birth Year/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
  });
});
