import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { THEME } from '@/context/themeContext';
import { ThemeProvider } from '@/context/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

describe('ThemeToggle', () => {
  it('switches theme when a radio option is selected', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe(THEME.LIGHT);

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe(THEME.DARK);
  });
});
