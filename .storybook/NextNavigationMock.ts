// __mocks__/nextNavigationMock.ts
// .storybook/NextNavigationMock.ts
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  refresh: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => Promise.resolve(),
  pathname: '/',
  query: {},
});

export const useParams = () => ({
  empcode: 'RDMC111',
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();

// export const useSearchParams = () => ({
//   get: (key: string) => {
//     const params = new URLSearchParams(window.location.search);
//     return params.get(key);
//   },
//   set: (key: string, value: string) => {
//     const params = new URLSearchParams(window.location.search);
//     params.set(key, value);
//     window.history.replaceState({}, "", `?${params.toString()}`);
//   },
// });