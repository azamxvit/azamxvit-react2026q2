import type { Theme } from '../../context/themeContext';
import { useTheme } from '../../context/useTheme';

const THEMES: Theme[] = ['light', 'dark'];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" data-testid="theme-toggle">
      <span className="theme-toggle__label">Theme:</span>
      {THEMES.map((option) => (
        <label key={option} className="theme-toggle__option">
          <input
            type="radio"
            name="theme"
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}
