import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { trackUserIdentification } from 'utils/analytics';

export const RouteGuard: React.FunctionComponent = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      trackUserIdentification(session.data.id);
    } else if (session.status === 'unauthenticated') {
      trackUserIdentification(null);
    }

    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const path = url.split('?')[0];

    if (session.status === 'loading') {
      return;
    }

    const isPublicPath = path === '/login' || path.endsWith('/embed');

    if (session.status !== 'authenticated' && !isPublicPath) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return authorized ? <>{children}</> : null;
};
