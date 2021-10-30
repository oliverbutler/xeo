import { Blocks } from 'components/Blocks/Blocks';
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
    <div>
      <h1 className="text-indigo-500 ">
        <FormattedMessage id="generic.welcome" />
        <Blocks />
      </h1>
    </div>
  );
};

export default Index;
