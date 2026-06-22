import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { THEME, ThemeProvider } from '@/context';
import { ThemeToggle } from '@/components/theme';
import messages from '../../../messages/en.json';

describe('ThemeToggle', () => {
  it('switches theme when a radio option is selected', async () => {
    const user = userEvent.setup();

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </NextIntlClientProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe(THEME.LIGHT);

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe(THEME.DARK);
  });
});
