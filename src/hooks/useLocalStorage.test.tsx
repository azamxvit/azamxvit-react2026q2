import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';
import { installLocalStorageMock } from '../test-utils/localStorage';

function Probe({ storageKey, initial }: { storageKey: string; initial?: string }) {
  const [value, setValue] = useLocalStorage(storageKey, initial);
  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue('updated')}>set</button>
    </div>
  );
}

describe('useLocalStorage', () => {
  beforeEach(() => {
    installLocalStorageMock();
  });

  it('falls back to the initial value when nothing is stored', () => {
    render(<Probe storageKey="missing" initial="default" />);

    expect(screen.getByTestId('value')).toHaveTextContent('default');
  });

  it('reads the stored value on mount', () => {
    const { seed } = installLocalStorageMock();
    seed('seeded', 'from-storage');

    render(<Probe storageKey="seeded" initial="default" />);

    expect(screen.getByTestId('value')).toHaveTextContent('from-storage');
  });

  it('persists updates to storage', async () => {
    const user = userEvent.setup();
    const { mockStorage } = installLocalStorageMock();

    render(<Probe storageKey="persist" initial="" />);

    await user.click(screen.getByRole('button', { name: 'set' }));

    expect(screen.getByTestId('value')).toHaveTextContent('updated');
    expect(mockStorage.setItem).toHaveBeenCalledWith('persist', 'updated');
  });

  it('keeps working when storage throws on read', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error('blocked');
        },
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      } as unknown as Storage,
    });

    act(() => {
      render(<Probe storageKey="any" initial="default" />);
    });

    expect(screen.getByTestId('value')).toHaveTextContent('default');

    if (original) {
      Object.defineProperty(window, 'localStorage', original);
    }
  });
});
