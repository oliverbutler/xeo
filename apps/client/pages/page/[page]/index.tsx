import { PageLayout } from 'components/Page/PageLayout/PageLayout';
import { usePageContext } from 'context/PageContext';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

const Page: React.FunctionComponent = () => {
  const { query } = useRouter();

  const { currentPageId, setCurrentPageId } = usePageContext();

  useEffect(() => {
    if (query.page) {
      setCurrentPageId(query.page as string);
    }
  }, [query]);

  return <PageLayout currentPageId={currentPageId} />;
};

export default Page;
