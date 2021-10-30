import { Page as PageComponent } from 'components/Page/Page';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { useGetBlockQuery } from 'generated';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const Page: React.FunctionComponent = () => {
  const {
    query: { page },
  } = useRouter();

  if (!page) {
    return <div>404</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="max-w-xl  w-full mx-auto p-4">
        <PageComponent blockId={page as string} />
      </div>
    </div>
  );
};

export default Page;
