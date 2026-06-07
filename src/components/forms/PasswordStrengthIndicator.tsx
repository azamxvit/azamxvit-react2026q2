import {
  getPasswordCriteria,
  PASSWORD_CRITERIA_LABELS,
} from '@/utils/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const criteria = getPasswordCriteria(password);

  return (
    <div className="password-strength" aria-live="polite">
      <p className="password-strength__title">Password strength:</p>
      <ul className="password-strength__list">
        {PASSWORD_CRITERIA_LABELS.map(({ key, label }) => (
          <li
            key={key}
            className={criteria[key] ? 'password-strength__item--met' : 'password-strength__item'}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
