import { THEME } from '@/context/themeContext';
import { useTheme } from '@/context/useTheme';
import { UI_LABELS } from '@/constants/labels';

const themeOptions = Object.values(THEME);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" data-testid="theme-toggle">
      <span className="theme-toggle__label">{UI_LABELS.theme.label}</span>
      {themeOptions.map((option) => (
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
