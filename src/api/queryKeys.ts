export const queryKeys = {
  characters: {
    all: ['characters'] as const,
    list: (search: string, page: number) =>
      ['characters', 'list', search, page] as const,
  },
  character: {
    all: ['character'] as const,
    detail: (id: string) => ['character', 'detail', id] as const,
  },
} as const;
