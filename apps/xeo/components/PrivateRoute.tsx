import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { PublicAppWrapper } from './PublicAppWrapper';

const publicRoutes = ['/', '/login'];

const PrivateAppWrapperDynamic = dynamic(
  // @ts-ignore
  () =>
    import('components/PrivateAppWrapper').then((mod) => mod.PrivateAppWrapper),
  { loading: () => null }
);

export const PrivateRoute: React.FunctionComponent = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();

  const pathIsProtected = !publicRoutes.includes(router.pathname);
  const isLoading = status === 'loading';
  const isAuthenticated = data && data.user;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathIsProtected) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, pathIsProtected]);

  if (isLoading) {
    return null;
  }

  if ((isLoading || !isAuthenticated) && pathIsProtected) {
    return null;
  }

  if (isAuthenticated) {
    return <PrivateAppWrapperDynamic>{children}</PrivateAppWrapperDynamic>;
  } else {
    return <PublicAppWrapper>{children}</PublicAppWrapper>;
  }
};
