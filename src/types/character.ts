export interface Character {
  name: string;
  birth_year: string;
  gender: string;
  url: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}