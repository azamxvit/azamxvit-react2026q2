import { describe, expect, it } from 'vitest';
import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  it('builds stable list keys from search and page', () => {
    expect(queryKeys.characters.list('luke', 2)).toEqual([
      'characters',
      'list',
      'luke',
      2,
    ]);
  });

  it('builds stable detail keys from character id', () => {
    expect(queryKeys.character.detail('1')).toEqual(['character', 'detail', '1']);
  });
});
