import classNames from 'classnames';
import { Blocks } from 'components/Blocks/Blocks';
import { Page } from 'components/Page/Page';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const Index: React.FunctionComponent = () => {
  const router = useRouter();
  const [accessToken] = useLocalStorage<string>('accessToken');

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="max-w-xl  w-full mx-auto p-4">
        <h1>Empty Dashboard</h1>
      </div>
    </div>
  );
};

export default Index;
