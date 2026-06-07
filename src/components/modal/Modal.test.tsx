import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders through a portal when open', () => {
    render(
      <Modal isOpen title="Test modal" onClose={vi.fn()}>
        <p>Modal body</p>
      </Modal>,
    );

    expect(screen.getByTestId('modal-dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('closes on Escape and backdrop click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Test modal" onClose={onClose}>
        <button type="button">Inside button</button>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('exposes dialog accessibility attributes', () => {
    render(
      <Modal isOpen title="Accessible modal" onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Accessible modal')).toBeInTheDocument();
  });
});
