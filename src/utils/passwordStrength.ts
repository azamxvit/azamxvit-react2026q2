export interface PasswordCriteria {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
}

const hasNumber = (value: string) => /\d/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasSpecialChar = (value: string) => /[^A-Za-z0-9]/.test(value);

export const getPasswordCriteria = (password: string): PasswordCriteria => ({
  hasNumber: hasNumber(password),
  hasUppercase: hasUppercase(password),
  hasLowercase: hasLowercase(password),
  hasSpecialChar: hasSpecialChar(password),
});

export const PASSWORD_CRITERIA_LABELS = [
  { key: 'hasNumber' as const, label: '1 number' },
  { key: 'hasUppercase' as const, label: '1 uppercase letter' },
  { key: 'hasLowercase' as const, label: '1 lowercase letter' },
  { key: 'hasSpecialChar' as const, label: '1 special character' },
];
