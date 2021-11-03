import { Loading } from 'components/Animate/Loading/Loading';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { useCurrentUser } from 'hooks/useCurrentUser';
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
  }, []);

  useEffect(() => {
    if (user) {
      const firstPage = user.pages?.find(() => true);
      router.push(`/page/${firstPage?.id}`);
    }
  }, [user]);
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex justify-center items-center flex-col">
        <Loading className="text-gray-300 h-12 w-12" />
      </div>
    </div>
  );
};

export default Index;
