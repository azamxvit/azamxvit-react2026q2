import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders a status role with the default message', () => {
    render(<Loader />);

    const status = screen.getByRole('status');
    expect(status).toHaveAccessibleName(/loading data/i);
  });

  it('honors the custom label prop', () => {
    render(<Loader label="Loading details..." />);

    expect(screen.getByRole('status')).toHaveAccessibleName(/loading details/i);
  });
});
