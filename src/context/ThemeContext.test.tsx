import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { THEME, ThemeProvider, useTheme } from '@/context';
import { ThemeToggle } from '@/components/theme';
import messages from '../../messages/en.json';

function ThemeReader() {
  const { theme } = useTheme();
  return <span data-testid="current-theme">{theme}</span>;
}

describe('ThemeContext', () => {
  it('applies the theme attribute to document.documentElement', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ThemeProvider>
          <ThemeToggle />
          <ThemeReader />
        </ThemeProvider>
      </NextIntlClientProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe(THEME.LIGHT);
    expect(screen.getByTestId('current-theme')).toHaveTextContent(THEME.LIGHT);
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    const Broken = () => {
      useTheme();
      return null;
    };

    expect(() => render(<Broken />)).toThrow(/ThemeProvider/i);
  });
});
