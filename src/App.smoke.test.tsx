import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as swapi from './api/swapi';
import { installLocalStorageMock } from './test-utils/localStorage';

vi.mock('./api/swapi', async () => {
  const actual = await vi.importActual<typeof swapi>('./api/swapi');
  return {
    ...actual,
    fetchCharacters: vi.fn(),
    fetchCharacterById: vi.fn(),
  };
});

const fetchCharacters = vi.mocked(swapi.fetchCharacters);

describe('App (smoke)', () => {
  beforeEach(() => {
    installLocalStorageMock();
    fetchCharacters.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mounts the router and renders the header navigation', async () => {
    render(<App />);

    expect(await screen.findByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument();
  });
});
