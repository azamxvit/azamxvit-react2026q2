export const useSearchParams = () => new URLSearchParams('page=1');
export const usePathname = () => '/en';
export const useRouter = () => ({
  push: () => undefined,
  replace: () => undefined,
  refresh: () => undefined,
});
