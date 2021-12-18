import { PageLayout } from 'components/Page/PageLayout/PageLayout';
import { usePageContext } from 'context/PageContext';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

const Page: React.FunctionComponent = () => {
  const { query } = useRouter();

  const page = query.page as string | undefined;

  const { setCurrentPageId } = usePageContext();

  useEffect(() => {
    if (page) {
      setCurrentPageId(page ?? null);
    }
  });

  return <PageLayout />;
};

export default Page;
