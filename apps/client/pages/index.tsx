import { PageLayout } from 'components/Page/PageLayout/PageLayout';
import { useCurrentUser } from 'hooks/useCurrentUser/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

const Index: React.FunctionComponent = () => {
  const router = useRouter();
  const [accessToken] = useLocalStorage<string>('accessToken');

  const { user } = useCurrentUser();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (user) {
      const firstPage = user.pages?.find(() => true);
      router.push(`/page/${firstPage?.id}`);
    }
  }, [router, user]);

  return <PageLayout />;
};

export default Index;
