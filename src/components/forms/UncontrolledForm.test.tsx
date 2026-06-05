import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UncontrolledForm } from './UncontrolledForm';
import { useFormStore } from '@/store/formStore';
import {
  createTestImageFile,
  uploadImageToInput,
  VALID_FORM_INPUT,
} from '@/test-utils/formTestHelpers';

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.getState().resetStore();
  });

  it('shows validation errors only after submit', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('submits valid data and stores a submission', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<UncontrolledForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/name/i), VALID_FORM_INPUT.name);
    await user.type(screen.getByLabelText(/^age$/i), VALID_FORM_INPUT.age);
    await user.type(screen.getByLabelText(/email/i), VALID_FORM_INPUT.email);
    await user.click(screen.getByRole('radio', { name: /^male$/i }));
    await user.type(screen.getByLabelText(/^password$/i), VALID_FORM_INPUT.password);
    await user.type(screen.getByLabelText(/confirm password/i), VALID_FORM_INPUT.confirmPassword);
    await user.type(screen.getByLabelText(/country/i), VALID_FORM_INPUT.country);
    await user.click(screen.getByLabelText(/terms and conditions/i));
    uploadImageToInput(
      screen.getByLabelText(/profile image/i) as HTMLInputElement,
      createTestImageFile(),
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(useFormStore.getState().submissions).toHaveLength(1);
    expect(useFormStore.getState().submissions[0].source).toBe('uncontrolled');
  });
});
