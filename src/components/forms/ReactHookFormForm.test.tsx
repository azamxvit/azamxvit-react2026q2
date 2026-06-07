import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReactHookFormForm } from './ReactHookFormForm';
import { useFormStore } from '@/store/formStore';
import { createTestImageFile, VALID_FORM_INPUT } from '@/test-utils/formTestHelpers';

describe('ReactHookFormForm', () => {
  beforeEach(() => {
    useFormStore.getState().resetStore();
  });

  it('disables submit while the form is invalid', () => {
    render(<ReactHookFormForm onSuccess={vi.fn()} />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('submits valid data and stores a submission', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<ReactHookFormForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/name/i), VALID_FORM_INPUT.name);
    await user.type(screen.getByLabelText(/^age$/i), VALID_FORM_INPUT.age);
    await user.type(screen.getByLabelText(/email/i), VALID_FORM_INPUT.email);
    await user.click(screen.getByRole('radio', { name: /^male$/i }));
    await user.type(screen.getByLabelText(/^password$/i), VALID_FORM_INPUT.password);
    await user.type(screen.getByLabelText(/confirm password/i), VALID_FORM_INPUT.confirmPassword);
    await user.type(screen.getByLabelText(/country/i), VALID_FORM_INPUT.country);
    await user.click(screen.getByLabelText(/terms and conditions/i));
    await user.upload(screen.getByLabelText(/profile image/i), createTestImageFile());

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => expect(submitButton).toBeEnabled(), { timeout: 3000 });
    await user.click(submitButton);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(useFormStore.getState().submissions).toHaveLength(1);
    expect(useFormStore.getState().submissions[0].source).toBe('react-hook-form');
  });
});
