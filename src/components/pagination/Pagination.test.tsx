import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('shows the current page label and exposes prev/next buttons', () => {
    render(
      <Pagination
        currentPage={2}
        hasPrevious
        hasNext
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 2');
    expect(screen.getByRole('button', { name: /prev/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  it('disables prev / next when navigation is not available', () => {
    render(
      <Pagination
        currentPage={1}
        hasPrevious={false}
        hasNext={false}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('emits the next page when next is clicked', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        hasPrevious
        hasNext
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('emits the previous page when prev is clicked', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        hasPrevious
        hasNext
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /prev/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
