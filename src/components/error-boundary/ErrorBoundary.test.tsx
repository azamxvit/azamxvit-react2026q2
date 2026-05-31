import { Component } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

// Class component is required here: only class children can throw during render
// in a way that Error Boundary catches reliably in tests.
class ToggleBomb extends Component<Record<string, never>, { boom: boolean }> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { boom: false };
  }

  render() {
    if (this.state.boom) {
      throw new Error('Triggered failure');
    }
    return (
      <button type="button" onClick={() => this.setState({ boom: true })}>
        Break things
      </button>
    );
  }
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Healthy UI</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Healthy UI')).toBeInTheDocument();
  });

  it('shows fallback UI when a child throws during render', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ToggleBomb />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: /break things/i }));

    expect(
      await screen.findByRole('heading', { name: /something went wrong/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Triggered failure')).toBeInTheDocument();
  });

  it('offers a reload action from the fallback UI', async () => {
    const user = userEvent.setup();
    const reload = vi.fn();

    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });

    render(
      <ErrorBoundary>
        <ToggleBomb />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: /break things/i }));
    await user.click(await screen.findByRole('button', { name: /reload page/i }));

    expect(reload).toHaveBeenCalledTimes(1);

    if (originalDescriptor) {
      Object.defineProperty(window, 'location', originalDescriptor);
    }
  });
});
