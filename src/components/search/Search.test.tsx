import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Search } from './Search';
import { renderWithRouter } from '@/test-utils/renderWithRouter';

describe('Search', () => {
  it('renders search input and submit button', () => {
    renderWithRouter(<Search initialValue="" onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText('Search Star Wars characters...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows the initial value from props', () => {
    renderWithRouter(<Search initialValue="yoda" onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText('Search Star Wars characters...')).toHaveValue('yoda');
  });

  it('updates the visible input when the user types', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Search initialValue="" onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    await user.type(input, 'han');

    expect(input).toHaveValue('han');
  });

  it('calls onSearch with trimmed text when the form is submitted', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    renderWithRouter(<Search initialValue="" onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    await user.type(input, '  obi  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('obi');
  });

  it('submits with Enter like a form submit', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    renderWithRouter(<Search initialValue="" onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search star wars/i), 'leia{enter}');

    expect(onSearch).toHaveBeenCalledWith('leia');
  });

});
