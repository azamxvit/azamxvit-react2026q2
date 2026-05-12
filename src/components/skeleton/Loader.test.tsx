import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders the loading message users see while waiting', () => {
    render(<Loader />);

    expect(screen.getByText(/loading data/i)).toBeInTheDocument();
  });
});
