import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../context/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('switches theme when a radio option is selected', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
