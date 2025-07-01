import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

type ParamsType = {
  [key: string]: string;
};

export function NextParamsProvider({ 
  children, 
  params = {} 
}: { 
  children: React.ReactNode;
  params?: ParamsType;
}) {
  const mockedUseParams = () => params;
  const mockedUsePathname = () => '/';
  const mockedUseSearchParams = () => new URLSearchParams();
  const mockedUseRouter = () => ({
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: () => {},
  });

  // @ts-ignore - we're mocking the hook
  useParams.mockImplementation(mockedUseParams);
  // @ts-ignore - we're mocking the hook
  usePathname.mockImplementation(mockedUsePathname);
  // @ts-ignore - we're mocking the hook
  useSearchParams.mockImplementation(mockedUseSearchParams);
  // @ts-ignore - we're mocking the hook
  useRouter.mockImplementation(mockedUseRouter);

  return <>{children}</>;
}
