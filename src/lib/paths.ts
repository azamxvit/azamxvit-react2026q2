export const buildHomePath = (query: Record<string, string>): string => {
  const params = new URLSearchParams(query);
  const search = params.toString();

  return search ? `/?${search}` : '/';
};

export const buildDetailsPath = (id: string, query: Record<string, string>): string => {
  const params = new URLSearchParams(query);
  const search = params.toString();
  const path = `/details/${id}`;

  return search ? `${path}?${search}` : path;
};
