import { beforeEach, describe, expect, it } from 'vitest';
import { useFormStore } from './formStore';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.getState().resetStore();
  });

  it('stores countries in state', () => {
    expect(useFormStore.getState().countries.length).toBeGreaterThan(0);
  });

  it('adds submissions to history and highlights the latest one', () => {
    const id = useFormStore.getState().addSubmission({
      source: 'uncontrolled',
      name: 'John',
      age: 30,
      email: 'john@example.com',
      gender: 'male',
      country: 'United States',
      imageBase64: 'data:image/jpeg;base64,abc',
    });

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].id).toBe(id);
    expect(state.highlightedId).toBe(id);
  });

  it('clears the highlight', () => {
    useFormStore.getState().addSubmission({
      source: 'react-hook-form',
      name: 'Jane',
      age: 25,
      email: 'jane@example.com',
      gender: 'female',
      country: 'Canada',
      imageBase64: 'data:image/jpeg;base64,def',
    });

    useFormStore.getState().clearHighlight();
    expect(useFormStore.getState().highlightedId).toBeNull();
  });
});
