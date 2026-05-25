import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';
import { ThemeToggle } from '../components/theme/ThemeToggle';

function ThemeReader() {
  const { theme } = useTheme();
  return <span data-testid="current-theme">{theme}</span>;
}

describe('ThemeContext', () => {
  it('applies the theme attribute to document.documentElement', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeReader />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    const Broken = () => {
      useTheme();
      return null;
    };

    expect(() => render(<Broken />)).toThrow(/ThemeProvider/i);
  });
});
